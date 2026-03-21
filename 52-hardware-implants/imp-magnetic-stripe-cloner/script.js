/**
 * imp-magnetic-stripe-cloner — Workshop DIY
 * Magnetic stripe card cloning simulation for fraud detection training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="25" width="70" height="50" rx="6" fill="none" stroke="currentColor" stroke-width="2"/><rect x="15" y="38" width="70" height="12" fill="currentColor" opacity=".3"/><line x1="20" y1="60" x2="55" y2="60" stroke="currentColor" stroke-width="1.5"/><line x1="20" y1="65" x2="45" y2="65" stroke="currentColor" stroke-width="1"/><circle cx="72" cy="35" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

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
    ...LANG_BASE.en,title:'Magnetic Stripe Cloner',subtitle:'💳 swipe · 📋 clone · 🛡️ detect',disconnected:'Disconnected',connected:'Connected',mainSection:'Magnetic Stripe Cloner — Card Skimming Lab',mainDesc:'Simulate magnetic stripe reading, cloning, and skimmer detection',sectionA:'How It Works',sectionB:'Lab — Magnetic Stripe Visualizer',sectionC:'Challenge',swipeBtn:'Swipe Card',cloneBtn:'Clone Data',detectBtn:'Detect Skimmer',howStep1:'Magnetic stripe cards store data on 3 tracks using magnetic flux patterns encoded at 75/210 BPI.',howStep2:'A skimmer reads the magnetic data when a card is swiped — capturing track 1 (name) and track 2 (number, expiry).',howStep3:'Cloners write captured data onto blank cards using an MSR device, creating a functional duplicate.',howStep4:'Detection uses visual inspection for overlay skimmers, RF scanning for wireless exfiltration, and jitter analysis.',ready:'💳 Magnetic Stripe Cloner ready — select operation!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip',step1Title:'Design Implant',step1Desc:'Magnetic stripe cards store data on 3 tracks using magnetic flux patterns encoded at 75/210 BPI.',step2Title:'Build & Program',step2Desc:'A skimmer reads the magnetic data when a card is swiped — capturing track 1 (name) and track 2 (number, expiry).',step3Title:'Deploy',step3Desc:'Cloners write captured data onto blank cards using an MSR device, creating a functional duplicate.',step4Title:'Monitor & Extract',step4Desc:'Detection uses visual inspection for overlay skimmers, RF scanning for wireless exfiltration, and jitter analysis.',sectionCode:'Device Code',faq_q1:'What is Magnetic Stripe Cloner?',faq_a1:'Magnetic Stripe Cloner lets you simulate magnetic stripe reading, cloning, and skimmer detection. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real hardware security behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real hardware security principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Imp Covert Audio Implant and Imp Evil Maid Toolkit. Each app in this category teaches a different aspect of hardware security.',demo_s1:'Welcome to Magnetic Stripe Cloner! Look at the main display — this is where the hardware security simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of hardware security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how hardware security works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches hardware security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Magnetic Stripe Cloner?',wiki_concept:'Magnetic Stripe Cloner is a technique used in hardware security. Simulate magnetic stripe reading, cloning, and skimmer detection. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Magnetic stripe cards store data on 3 tracks using magnetic flux patterns encoded at 75/210 BPI. Second: A skimmer reads the magnetic data when a card is swiped — capturing track 1 (name) and track 2 (number, expiry). The simulation runs these stages in real time, showing you intermediate results at each step. In real hardware security, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Magnetic Stripe Cloner has practical applications in hardware security. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Magnetic Stripe Cloner: Simulate magnetic stripe reading, cloning, and skimmer detection. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Design Implant through Build & Program to Deploy and Monitor & Extract.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab — Magnetic Stripe Visualizer" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Magnetic Stripe Cloner',subtitle:'💳 glisser · 📋 cloner · 🛡️ détecter',disconnected:'Déconnecté',connected:'Connecté',mainSection:'Cloneur de piste magnétique',mainDesc:'Simulez la lecture et le clonage de piste magnétique',sectionA:'Comment ça marche',sectionB:'Labo — Visualiseur magnétique',sectionC:'Défi',swipeBtn:'Glisser',cloneBtn:'Cloner',detectBtn:'Détecter',ready:'💳 Cloneur prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer',step1Title:'Concevoir l\'implant',step1Desc:'Magnetic stripe cards store data on 3 tracks using magnetic flux patterns encoded at 75/210 BPI.',step2Title:'Construire et programmer',step2Desc:'A skimmer reads the magnetic data when a card is swiped — capturing track 1 (name) and track 2 (number, expiry).',step3Title:'Déployer',step3Desc:'Cloners write captured data onto blank cards using an MSR device, creating a functional duplicate.',step4Title:'Surveiller et extraire',step4Desc:'Detection uses visual inspection for overlay skimmers, RF scanning for wireless exfiltration, and jitter analysis.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule hardware implants ! 🔬 Tu peux expérimenter avec covert hardware devices en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais covert hardware devices.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai physical security and implant design ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Imp Rogue Charger Lab and Imp Supply Chain Backdoor ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'Magnetic Stripe Cloner',subtitle:'💳 تمرير · 📋 استنساخ · 🛡️ كشف',disconnected:'غير متصل',connected:'متصل',mainSection:'مستنسخ الشريط المغناطيسي — مختبر النسخ',mainDesc:'محاكاة قراءة واستنساخ الشريط المغناطيسي وكشف أجهزة النسخ',sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',swipeBtn:'تمرير',cloneBtn:'استنساخ',detectBtn:'كشف',ready:'💳 مستنسخ الشريط المغناطيسي جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي',step1Title:'تصميم الزرع',step1Desc:'Magnetic stripe cards store data on 3 tracks using magnetic flux patterns encoded at 75/210 BPI.',step2Title:'بناء وبرمجة',step2Desc:'A skimmer reads the magnetic data when a card is swiped — capturing track 1 (name) and track 2 (number, expiry).',step3Title:'نشر',step3Desc:'Cloners write captured data onto blank cards using an MSR device, creating a functional duplicate.',step4Title:'مراقبة واستخراج',step4Desc:'Detection uses visual inspection for overlay skimmers, RF scanning for wireless exfiltration, and jitter analysis.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي hardware implants! 🔬 يمكنك التجربة مع covert hardware devices في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج covert hardware devices حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا physical security and implant design حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Imp Rogue Charger Lab and Imp Supply Chain Backdoor! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch{}log(s.langChanged,'info')}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click()}

let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter()})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none'})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}

function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open')}
function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
function openSettings(){openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click')}

let matrixRunning=false,matrixAnim=null;
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=innerWidth;canvas.height=innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);const chars='بسمالرحنيوكلتعدفقثصضطظغشزخجذ01';(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)})()}

/* ═══════ APP-SPECIFIC: MAGNETIC STRIPE CLONER ═══════ */
let swiping=false;
let magParticles=[];
let capturedCards=[];
let waveTime=0;
let swipeProgress=0;

function randomCardNumber(){return Array.from({length:4},()=>Math.floor(Math.random()*9000+1000)).join(' ')}
function randomTrackData(){
  const num=randomCardNumber().replace(/ /g,'');
  const exp=`${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}/${String(Math.floor(Math.random()*6)+25)}`;
  const name=['SMITH/JOHN','DOE/JANE','AHMED/ALI','MARTIN/CLAIRE','TANAKA/YUKI'][Math.floor(Math.random()*5)];
  return{track1:`%B${num}^${name}^${exp.replace('/','0')}1${Math.floor(Math.random()*9000+1000)}?`,track2:`;${num}=${exp.replace('/','0')}1${Math.floor(Math.random()*90000+10000)}?`,name,number:num.replace(/(.{4})/g,'$1 ').trim(),expiry:exp,timestamp:new Date().toLocaleTimeString()};
}

function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;

  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    waveTime+=0.02;

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<canvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}

    // Card reader slot (left)
    const readerX=70,readerY=canvas.height/2;
    ctx.fillStyle='#111';ctx.strokeStyle=accent;ctx.lineWidth=2;
    ctx.fillRect(readerX-35,readerY-50,70,100);ctx.strokeRect(readerX-35,readerY-50,70,100);
    // Slot opening
    ctx.fillStyle='#000';ctx.fillRect(readerX-20,readerY-3,40,6);
    ctx.fillStyle=accent;ctx.font='8px Orbitron';ctx.fillText('MSR',readerX-10,readerY-35);
    ctx.fillText('READER',readerX-16,readerY+45);

    // Card (moving during swipe)
    const cardBaseX=canvas.width-130;
    const cardX=swiping?cardBaseX-swipeProgress*(cardBaseX-readerX-20):cardBaseX;
    const cardY=readerY;
    ctx.save();ctx.translate(cardX,cardY);
    // Card body
    ctx.fillStyle='#1a1a3e';ctx.strokeStyle='#4488ff';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(-50,-32,100,64,6);ctx.fill();ctx.stroke();
    // Magnetic stripe
    ctx.fillStyle='#222';ctx.fillRect(-45,-10,90,12);
    // Magnetic data visualization on stripe
    for(let i=0;i<30;i++){
      const x=-42+i*3;const h=Math.sin(waveTime*3+i*0.5)*4;
      ctx.fillStyle=swiping?`rgba(255,51,51,${0.5+Math.sin(waveTime*5+i)*0.3})`:'#444';
      ctx.fillRect(x,-4+h,2,Math.abs(h)+2);
    }
    // Card chip
    ctx.fillStyle='#d4a03c';ctx.fillRect(-35,-28,16,12);ctx.strokeStyle='#b8860b';ctx.lineWidth=0.5;ctx.strokeRect(-35,-28,16,12);
    // Card number hint
    ctx.fillStyle='#667';ctx.font='7px Orbitron';ctx.fillText('XXXX XXXX',-20,20);
    ctx.restore();

    // Read head animation
    if(swiping){
      const readX=readerX;
      ctx.strokeStyle='#ff3333';ctx.lineWidth=1;ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(cardX+50,cardY);ctx.lineTo(readX-20,readerY);ctx.stroke();
      ctx.setLineDash([]);
      // Magnetic flux lines
      for(let i=0;i<5;i++){
        const phase=(waveTime*4+i*1.5)%5;const r=phase/5*30;const alpha=1-phase/5;
        ctx.strokeStyle=`rgba(255,51,51,${alpha*0.4})`;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(readerX,readerY,10+r,-1,1);ctx.stroke();
      }
      ctx.fillStyle='#ff3333';ctx.font='10px Orbitron';
      ctx.fillText('READING STRIPE',canvas.width/2-50,20);
    }

    // Track data display
    if(capturedCards.length>0){
      const last=capturedCards[capturedCards.length-1];
      ctx.fillStyle='rgba(51,255,51,0.8)';ctx.font='7px Orbitron';
      ctx.fillText('T1: '+last.track1.slice(0,35)+'...',20,canvas.height-40);
      ctx.fillText('T2: '+last.track2.slice(0,35)+'...',20,canvas.height-28);
    }

    // Particles
    for(let i=magParticles.length-1;i>=0;i--){
      const p=magParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.015;
      if(p.life<=0){magParticles.splice(i,1);continue}
      ctx.globalAlpha=p.life;ctx.fillStyle=p.color||'#ff3333';
      ctx.beginPath();ctx.arc(p.x,p.y,p.size||2,0,Math.PI*2);ctx.fill();
      if(p.label){ctx.font='6px Orbitron';ctx.fillText(p.label,p.x+4,p.y-2)}
      ctx.globalAlpha=1;
    }

    // Status bar
    ctx.fillStyle='rgba(51,255,51,0.1)';ctx.fillRect(50,canvas.height-18,canvas.width-100,8);
    ctx.fillStyle='#33ff33';ctx.font='8px Orbitron';
    ctx.fillText(`CARDS: ${capturedCards.length} | BPI: 210 | TRACKS: 1,2,3`,50,canvas.height-6);

    requestAnimationFrame(draw);
  }draw();
}

function spawnMagParticles(count,color){
  const canvas=$('simCanvas');if(!canvas)return;
  const labels=['BIT','FLUX','T1','T2','CRC','LRC','STX'];
  for(let i=0;i<count;i++){
    magParticles.push({x:70+Math.random()*20,y:canvas.height/2-15+Math.random()*30,vx:2+Math.random()*3,vy:(Math.random()-0.5)*2,life:0.4+Math.random()*0.4,color:color||'#ff3333',size:2+Math.random()*2,label:Math.random()>0.6?labels[Math.floor(Math.random()*labels.length)]:null});
  }
}

function initMagSim(){
  const swipeBtn=$('swipeBtn'),cloneBtn=$('cloneBtn'),detectBtn=$('detectBtn');
  const outputDisplay=$('outputDisplay'),dataLog=$('dataLog');
  const implantDot=$('implantDot'),implantStatusText=$('implantStatusText');

  if(swipeBtn)swipeBtn.addEventListener('click',()=>{
    if(swiping)return;
    swiping=true;swipeProgress=0;
    if(implantDot)implantDot.classList.add('active');
    if(implantStatusText)implantStatusText.textContent='Reader: SWIPING...';
    setStatus(true);showToast('Swiping card...',2000);
    log('💳 Card swipe initiated — reading magnetic stripe...','info');

    const swipeIv=setInterval(()=>{
      swipeProgress+=0.02;
      spawnMagParticles(3,'#ff3333');
      if(swipeProgress>=1){
        clearInterval(swipeIv);swiping=false;swipeProgress=0;
        const card=randomTrackData();capturedCards.push(card);
        if(dataLog)dataLog.textContent=capturedCards.slice(-5).map(c=>`[${c.timestamp}] ${c.name} ${c.number}`).join('\n');
        if(outputDisplay)outputDisplay.textContent=[`CARD DATA CAPTURED`,`══════════════════`,`Name: ${card.name}`,`Number: ${card.number}`,`Expiry: ${card.expiry}`,``,`Track 1: ${card.track1}`,`Track 2: ${card.track2}`,``,`Encoding: ISO 7811`,`BPI: 210 (Track 2)`].join('\n');
        log(`💳 Card captured: ${card.name} — ${card.number}`,'rx');
        if(implantDot)implantDot.classList.remove('active');
        if(implantStatusText)implantStatusText.textContent='Reader: Card captured';
        hideToast();
      }
    },40);
  });

  if(cloneBtn)cloneBtn.addEventListener('click',()=>{
    if(capturedCards.length===0){log('No cards captured yet','error');return}
    showToast('Cloning card to blank...',2500);log('📋 Writing magnetic data to blank card...','info');
    spawnMagParticles(20,'#ff6600');
    setTimeout(()=>{
      const card=capturedCards[capturedCards.length-1];
      if(outputDisplay)outputDisplay.textContent=[`CLONE COMPLETE`,`══════════════════`,`Source: ${card.name}`,`Written tracks: 1, 2`,`Encoding: F2F (Aiken Biphase)`,`Coercivity: Hi-Co 4000 Oe`,`Verification: PASS`,``,`⚠️ Clone is functional replica`,`Detection: Jitter analysis, CVV mismatch`].join('\n');
      log('📋 Card cloned successfully — written to blank','success');hideToast();
    },2000);
  });

  if(detectBtn)detectBtn.addEventListener('click',()=>{
    showToast('Scanning for skimmer devices...',2500);log('🛡️ Skimmer detection scan...','info');
    spawnMagParticles(25,'#4488ff');
    let step=0;
    const checks=['Visual overlay inspection','Bluetooth scan (HC-05/06)','Card slot wiggle test','Pinhole camera check','RF emission sweep'];
    const iv=setInterval(()=>{
      if(step<checks.length){log(`🔍 ${checks[step]}...`,'info');step++}
      else{
        clearInterval(iv);const found=Math.random()>0.5;
        if(outputDisplay)outputDisplay.textContent=found?['⚠️ SKIMMER DETECTED','══════════════════','Type: Overlay skimmer','Bluetooth: HC-06 (active)','Signal: -45 dBm','Camera: Pinhole found near PIN pad','','RECOMMENDED:','• Do not use this ATM','• Report to bank','• Cover PIN entry always'].join('\n'):['✅ NO SKIMMER DETECTED','══════════════════','Overlay: None found','Bluetooth: No rogue devices','Card slot: Firmly attached','PIN pad: No cameras detected','','ATM appears safe to use.'].join('\n');
        log(found?'🚨 Skimmer detected on card reader!':'✅ No skimmer found — reader appears clean',found?'error':'success');hideToast();
      }
    },500);
  });

  const sweepBtn=$('sweepBtn');
  if(sweepBtn)sweepBtn.addEventListener('click',()=>{spawnMagParticles(30,'#d4a03c');log('📡 Magnetic stripe analysis sweep...','info');showToast('Analyzing magnetic patterns...',3000);let step=0;const phases=['Track 1 (IATA)','Track 2 (ABA)','Track 3 (THRIFT)','Coercivity measurement','Jitter analysis'];const iv=setInterval(()=>{if(step<phases.length){if(dataLog)dataLog.textContent+=`\n[SWEEP] ${phases[step]}...`;step++}else{clearInterval(iv);log('📡 Magnetic analysis complete','success')}},500)});
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn')&&($('clearLogBtn').onclick=clearLog);$('copyLogBtn')&&($('copyLogBtn').onclick=copyLog);$('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);initLogFilters();
  $('helpBtn')&&($('helpBtn').onclick=openHelp);$('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp);$('helpOverlay')&&($('helpOverlay').onclick=closeHelp);initHelpTabs();
  $('settingsBtn')&&($('settingsBtn').onclick=openSettings);$('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings);$('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);
  $('logBtn')&&($('logBtn').onclick=toggleLog);$('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate();initSimCanvas();initMagSim();
  log(LANG[currentLang].ready,'success');
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
