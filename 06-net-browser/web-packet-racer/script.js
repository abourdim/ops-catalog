/**
 * Workshop DIY — Packet Racer v1.2
 * Network Racing — Be a packet navigating routers, firewalls, and congested links
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.42,152.87C187.48,152.74,187.66,152.63,187.82,152.63C188.09,152.63,190.48,151.54,191.62,150.9L194.17,149.21C197.43,146.97,199.24,146.24,202.59,145.78C203.8,145.62,204.63,145.62,205.93,145.78C212.62,146.63,217.42,150.72,219.33,157.2C219.72,158.55,219.77,162.69,219.41,163.88C218.19,167.86,216.58,170.3,213.79,172.41C209.46,175.7,203.83,176.56,198.81,174.72L187.29,168.46L187.31,160.79z"/><path style="stroke:none;fill:currentColor" d="M259.79,157.67L264.88,148.03H272.34L263.03,163.73V174.99H256.26V164.07L246.79,148.03H254.51z"/><path style="stroke:none;fill:currentColor" d="M240.37,152.74H236.5V170.28H240.37V174.99H225.85V170.28H229.72V152.74H225.85V148.03H240.37z"/><path style="stroke:none;fill:currentColor" d="M330.79,195.73H203.96V199.33H330.79zM330.79,203.35H161.69V206.96H330.79zM330.79,210.97H77.14V214.58H330.79z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6gMKAjgH2Wn1xgAAAAxJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAvBm8AAAB8IkWQwAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'Packet Racer',subtitle:'Be a packet navigating routers, firewalls, and congested links',disconnected:'Disconnected',connected:'Connected',mainSection:'Network Race',mainDesc:'Navigate through the network topology',sectionA:'Network Obstacles',sectionB:'Network Concepts',sectionC:'High Scores',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Click Start Race.',howto_2:'Use arrow keys to navigate.',howto_3:'Avoid obstacles.',howto_4:'Reach the destination.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'Trilingual.',wiki_log_title:'Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'Privacy',wiki_privacy:'Local-first.',working:'Working...',ready:'Packet Racer ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',newVersion:'UPDATE',langChanged:'Language > English',themeChanged:'Theme >',startBtn:'Start Race',resetBtn:'Reset',score:'Score',health:'HP',timer:'Time',obstacleText:'Firewalls (red) block. Congestion (orange) slows. Packet loss (purple) damages. Routers (green) give bonus.',conceptText:'Packets travel through hops. Each adds latency. Firewalls filter. Congestion = bandwidth exceeded.',scoreText:'Your best race times and scores.',raceStarted:'Race started! Navigate to the destination!',hitFirewall:'Hit firewall! Blocked!',hitCongestion:'Congestion zone! Slowed down!',hitPacketLoss:'Packet loss! -20 HP!',hitRouter:'Router checkpoint! +50 points!',raceWon:'RACE WON! Destination reached!',raceLost:'GAME OVER! Health depleted!',pressStart:'Press Start Race to begin',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It lets you see how computer networks talk to each other! 🌐 Like X-ray vision for internet traffic.',faq_q2:'How does it work?',faq_a2:'The simulation shows real network protocols — the rules that computers follow to send data across the internet.',faq_q3:'What should I try first?',faq_a3:'Start a scan and watch the packets fly! 📡 Each colored packet is a different type of network message.',faq_q4:'What\'s the real science?',faq_a4:'This is how the entire internet works! TCP/IP, DNS, ARP — these protocols power every website you visit. 🌍',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See what happens when you inject bad packets or flood the network. That\'s network security! 🛡️',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Totally safe! 🛡️ This is a simulation — no real network traffic. Everything stays in your browser.',faq_q8:'What should I try next?',faq_a8:'Try Web Firewall Fortress and Web Mitm Sim! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',learnAge:'Ages:'},
  fr:{title:'Course de Paquets',subtitle:'Soyez un paquet naviguant parmi routeurs, pare-feu et liens',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Course Reseau',mainDesc:'Naviguer dans la topologie',sectionA:'Obstacles Reseau',sectionB:'Concepts Reseau',sectionC:'Meilleurs Scores',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Cliquez Demarrer.',howto_2:'Utilisez les fleches.',howto_3:'Evitez les obstacles.',howto_4:'Atteignez la destination.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'Trilingue.',wiki_log_title:'Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Local.',working:'En cours...',ready:'Course de Paquets prete!',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',soundEffects:'Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'passer',newVersion:'MAJ',langChanged:'Langue > Francais',themeChanged:'Theme >',startBtn:'Demarrer Course',resetBtn:'Reinitialiser',score:'Score',health:'PV',timer:'Temps',obstacleText:'Pare-feu (rouge) bloque. Congestion (orange) ralentit. Perte (violet) endommage. Routeurs (vert) bonus.',conceptText:'Les paquets traversent des sauts. Les pare-feu filtrent. La congestion = bande passante depassee.',scoreText:'Vos meilleurs temps et scores.',raceStarted:'Course lancee! Naviguez vers la destination!',hitFirewall:'Pare-feu! Bloque!',hitCongestion:'Zone de congestion! Ralenti!',hitPacketLoss:'Perte de paquet! -20 PV!',hitRouter:'Point de controle routeur! +50 points!',raceWon:'COURSE GAGNEE! Destination atteinte!',raceLost:'FIN! Sante epuisee!',pressStart:'Appuyez Demarrer',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Firewall Fortress and Web Mitm Sim ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{title:'سباق الحزم',subtitle:'كن حزمة تتنقل بين الموجهات والجدران النارية',disconnected:'غير متصل',connected:'متصل',mainSection:'سباق الشبكة',mainDesc:'تنقل عبر طوبولوجيا الشبكة',sectionA:'عقبات الشبكة',sectionB:'مفاهيم الشبكة',sectionC:'افضل النتائج',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'انقر بدء السباق.',howto_2:'استخدم الاسهم للتنقل.',howto_3:'تجنب العقبات.',howto_4:'اصل الى الوجهة.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'الخصوصية',wiki_privacy:'محلي.',working:'جار...',ready:'سباق الحزم جاهز!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',soundEffects:'صوت',whisperMode:'همس',breathingGuide:'تنفس',dhikrTap:'اضغط',musicMode:'موسيقى',splashHint:'تخطي',newVersion:'تحديث',langChanged:'اللغة > العربية',themeChanged:'المظهر >',startBtn:'بدء السباق',resetBtn:'اعادة ضبط',score:'النقاط',health:'الصحة',timer:'الوقت',obstacleText:'الجدران النارية (احمر) تحجب. الازدحام (برتقالي) يبطئ. فقدان الحزم (بنفسجي) يضر. الموجهات (اخضر) مكافأة.',conceptText:'تمر الحزم عبر قفزات. الجدران النارية تصفي. الازدحام = تجاوز عرض النطاق.',scoreText:'افضل اوقاتك ونتائجك.',raceStarted:'بدأ السباق! انتقل الى الوجهة!',hitFirewall:'جدار ناري! محجوب!',hitCongestion:'منطقة ازدحام! تباطؤ!',hitPacketLoss:'فقدان حزمة! -20 صحة!',hitRouter:'نقطة تفتيش موجه! +50 نقطة!',raceWon:'فزت بالسباق! تم الوصول!',raceLost:'انتهت اللعبة! نفدت الصحة!',pressStart:'اضغط بدء السباق',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Web Firewall Fortress and Web Mitm Sim! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};
/* ═══════ TEMPLATE BOILERPLATE ═══════ */
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(type==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logWithHistory(msg,type);applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function pulseBismillah(type){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(type==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const logHistory=[];function logWithHistory(msg,type){logHistory.push({msg,type,ts:Date.now()});}function initTimeTravel(){document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='z'){const p=$('logPanel');if(!p||!p.classList.contains('open'))return;e.preventDefault();if(!logContainer)logContainer=$('logContainer');if(logContainer&&logContainer.lastChild){logContainer.removeChild(logContainer.lastChild);logHistory.pop();playSound('click');}}});}
let typewriterEnabled=true;async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function toggleWhisper(){}function toggleMusicMode(){}
function initGhostUsers(){}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>breathingActive?b.classList.add('breathing'):b.classList.remove('breathing'));if(!breathingActive)dhikrCount=0;}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};let petState='idle',petIdleTimer=null,petSleepTimer=null;function initPixelPet(){const pet=document.createElement('div');pet.id='pixelPet';pet.className='pixel-pet pet-idle';pet.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;pet.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(pet,f.firstChild);}function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initLogoTracker(){const l=$('logoWrap');if(!l)return;document.addEventListener('mousemove',e=>{const r=l.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/(innerWidth/2);const dy=(e.clientY-(r.top+r.height/2))/(innerHeight/2);l.style.transform=`perspective(200px) rotateX(${dy*8}deg) rotateY(${-dx*8}deg)`;});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let dragging=false,startX,startW;h.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=p.offsetWidth;document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';document.body.style.userSelect='';});}
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(rid);if(b)b.focus();}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}function trapFocus(e){for(const id of['helpPanel','settingsPanel','logPanel']){const sb=$(id);if(!sb||!sb.classList.contains('open'))continue;const focusable=sb.querySelectorAll(FOCUSABLE);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ';function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#4fc3f7';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initKonami(){const K=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let idx=0;document.addEventListener('keydown',e=>{if(e.key===K[idx]){idx++;if(idx===K.length){idx=0;setTheme('retro');log('KONAMI!','success');}}else idx=0;});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const p=$('debugPanel');if(p)p.classList.add('active');}

/* ══════════════════════════════════════════════════════════════
   APP-SPECIFIC: PACKET RACER
   ══════════════════════════════════════════════════════════════ */
const CELL=35;const COLS=20;const ROWS=12;
let raceCanvas,raceCtx;
let player={x:0,y:5};let gameRunning=false;let score=0;let health=100;let raceTime=0;let raceInterval=null;
let grid=[];let highScores=[];
const TILE={EMPTY:0,FIREWALL:1,CONGESTION:2,PACKETLOSS:3,ROUTER:4,DEST:5,START:6};
const TILE_COLORS={[TILE.EMPTY]:'#0a0e18',[TILE.FIREWALL]:'#ef5350',[TILE.CONGESTION]:'#ff9800',[TILE.PACKETLOSS]:'#ab47bc',[TILE.ROUTER]:'#66bb6a',[TILE.DEST]:'#4fc3f7',[TILE.START]:'#66bb6a'};
const TILE_ICONS={[TILE.FIREWALL]:'\uD83D\uDD25',[TILE.CONGESTION]:'\uD83D\uDEA7',[TILE.PACKETLOSS]:'\uD83D\uDCA8',[TILE.ROUTER]:'\uD83D\uDD00',[TILE.DEST]:'\uD83C\uDFAF',[TILE.START]:'\uD83D\uDCE6'};

function generateGrid(){
  grid=[];
  for(let y=0;y<ROWS;y++){grid[y]=[];for(let x=0;x<COLS;x++)grid[y][x]=TILE.EMPTY;}
  grid[5][0]=TILE.START;grid[5][COLS-1]=TILE.DEST;
  // Routers (checkpoints)
  [[5,5],[3,10],[8,10],[5,15]].forEach(([ry,rx])=>{if(grid[ry])grid[ry][rx]=TILE.ROUTER;});
  // Firewalls
  for(let i=0;i<12;i++){const x=2+Math.floor(Math.random()*(COLS-4));const y=Math.floor(Math.random()*ROWS);if(grid[y][x]===TILE.EMPTY)grid[y][x]=TILE.FIREWALL;}
  // Congestion zones
  for(let i=0;i<8;i++){const x=2+Math.floor(Math.random()*(COLS-4));const y=Math.floor(Math.random()*ROWS);if(grid[y][x]===TILE.EMPTY)grid[y][x]=TILE.CONGESTION;}
  // Packet loss
  for(let i=0;i<6;i++){const x=2+Math.floor(Math.random()*(COLS-4));const y=Math.floor(Math.random()*ROWS);if(grid[y][x]===TILE.EMPTY)grid[y][x]=TILE.PACKETLOSS;}
}

function drawRace(){
  if(!raceCtx)return;const c=raceCanvas,ctx=raceCtx;
  ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#060a14';ctx.fillRect(0,0,c.width,c.height);
  // Grid lines
  ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=1;
  for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(x*CELL,0);ctx.lineTo(x*CELL,ROWS*CELL);ctx.stroke();}
  for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*CELL);ctx.lineTo(COLS*CELL,y*CELL);ctx.stroke();}
  // Tiles
  for(let y=0;y<ROWS;y++){for(let x=0;x<COLS;x++){
    const tile=grid[y][x];if(tile===TILE.EMPTY)continue;
    const color=TILE_COLORS[tile];
    ctx.fillStyle=color+'20';ctx.fillRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);
    ctx.strokeStyle=color+'60';ctx.lineWidth=1;ctx.strokeRect(x*CELL+1,y*CELL+1,CELL-2,CELL-2);
    const icon=TILE_ICONS[tile];if(icon){ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(icon,x*CELL+CELL/2,y*CELL+CELL/2+5);}
  }}
  // Player
  if(gameRunning||score>0){
    const px=player.x*CELL+CELL/2;const py=player.y*CELL+CELL/2;
    ctx.beginPath();ctx.arc(px,py,CELL/2-4,0,Math.PI*2);ctx.fillStyle='#4fc3f740';ctx.fill();
    ctx.strokeStyle='#4fc3f7';ctx.lineWidth=2;ctx.stroke();
    ctx.font='18px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('\uD83D\uDCE7',px,py+6);
    // Glow
    ctx.beginPath();ctx.arc(px,py,CELL/2+2,0,Math.PI*2);ctx.strokeStyle='#4fc3f730';ctx.lineWidth=3;ctx.stroke();
  }
  // Not started message
  if(!gameRunning&&score===0&&health===100){
    ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#fff';ctx.font='bold 18px Orbitron,sans-serif';ctx.textAlign='center';
    ctx.fillText(LANG[currentLang].pressStart,c.width/2,c.height/2);
  }
}

function movePlayer(dx,dy){
  if(!gameRunning)return;
  const nx=player.x+dx;const ny=player.y+dy;
  if(nx<0||nx>=COLS||ny<0||ny>=ROWS)return;
  const tile=grid[ny][nx];const s=LANG[currentLang];
  if(tile===TILE.FIREWALL){log(s.hitFirewall,'error');playSound('error');return;}
  player.x=nx;player.y=ny;
  if(tile===TILE.CONGESTION){log(s.hitCongestion,'info');score=Math.max(0,score-10);}
  else if(tile===TILE.PACKETLOSS){health-=20;log(s.hitPacketLoss,'error');playSound('error');if(health<=0){endRace(false);return;}}
  else if(tile===TILE.ROUTER){score+=50;log(s.hitRouter,'success');playSound('success');grid[ny][nx]=TILE.EMPTY;}
  else if(tile===TILE.DEST){score+=100;endRace(true);return;}
  score+=5;updateHUD();drawRace();
}

function startRace(){
  if(gameRunning)return;
  const s=LANG[currentLang];
  generateGrid();player={x:0,y:5};score=0;health=100;raceTime=0;gameRunning=true;
  setStatus(true);updateHUD();drawRace();log(s.raceStarted,'success');
  raceInterval=setInterval(()=>{raceTime+=0.1;const tv=$('timerVal');if(tv)tv.textContent=raceTime.toFixed(1);},100);
  const canvas=$('raceCanvas');if(canvas)canvas.focus();
}

function endRace(won){
  gameRunning=false;if(raceInterval){clearInterval(raceInterval);raceInterval=null;}
  const s=LANG[currentLang];
  if(won){
    log(`${s.raceWon} Score: ${score}, Time: ${raceTime.toFixed(1)}s`,'success');
    highScores.push({score,time:raceTime.toFixed(1)});highScores.sort((a,b)=>b.score-a.score);
    highScores=highScores.slice(0,5);updateHighScores();
  }else{log(s.raceLost,'error');}
  updateHUD();drawRace();
}

function resetRace(){
  if(raceInterval){clearInterval(raceInterval);raceInterval=null;}
  gameRunning=false;generateGrid();player={x:0,y:5};score=0;health=100;raceTime=0;
  updateHUD();drawRace();
}

function updateHUD(){
  const sv=$('scoreVal'),hv=$('healthVal'),tv=$('timerVal');
  if(sv)sv.textContent=score;if(hv)hv.textContent=health;if(tv)tv.textContent=raceTime.toFixed(1);
  if(hv)hv.style.color=health>50?'#66bb6a':health>20?'#ff9800':'#ef5350';
}

function updateHighScores(){
  const el=$('highScores');if(!el)return;
  if(highScores.length===0){el.innerHTML='<em style="opacity:.5;">No scores yet</em>';return;}
  let html='';highScores.forEach((s,i)=>{
    html+=`<div style="display:flex;justify-content:space-between;padding:.3rem .5rem;margin-bottom:.2rem;background:rgba(255,255,255,0.03);border-radius:4px;font-size:.85rem;">
      <span>#${i+1}</span><strong>${s.score} pts</strong><span>${s.time}s</span>
    </div>`;
  });el.innerHTML=html;
}

function initPacketRacer(){
  raceCanvas=$('raceCanvas');if(raceCanvas){raceCtx=raceCanvas.getContext('2d');generateGrid();drawRace();}
  const sb=$('startRaceBtn');if(sb)sb.addEventListener('click',startRace);
  const rb=$('resetRaceBtn');if(rb)rb.addEventListener('click',resetRace);
  // Keyboard controls
  document.addEventListener('keydown',e=>{
    if(!gameRunning)return;
    switch(e.key){case'ArrowUp':movePlayer(0,-1);e.preventDefault();break;case'ArrowDown':movePlayer(0,1);e.preventDefault();break;case'ArrowLeft':movePlayer(-1,0);e.preventDefault();break;case'ArrowRight':movePlayer(1,0);e.preventDefault();break;}
  });
  // Button controls
  const ub=$('upBtn'),db=$('downBtn'),lb=$('leftBtn'),rrb=$('rightBtn');
  if(ub)ub.addEventListener('click',()=>movePlayer(0,-1));
  if(db)db.addEventListener('click',()=>movePlayer(0,1));
  if(lb)lb.addEventListener('click',()=>movePlayer(-1,0));
  if(rrb)rrb.addEventListener('click',()=>movePlayer(1,0));
  updateHighScores();
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();if(e.key==='Tab')trapFocus(e);});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}
  initKonami();initMatrixTrigger();initDebug();initTimeTravel();initHijriDate();initGhostUsers();initPixelPet();initLogoTracker();
  initPacketRacer();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Network Latency & Hop Visualizer ═══════ */
(function(){
let nCanvas,nCtx;const hopNodes=[];const hopParticles=[];let latencyData=[];
function createNC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Packet Route Tracer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=230;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;';
  w.appendChild(c);t.appendChild(w);return c;
}
function initHops(){
  const labels=['Client','Router A','ISP','Backbone','Router B','Server'];
  const colors=['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
  labels.forEach((l,i)=>{hopNodes.push({x:50+i*(520/5),y:60,label:l,color:colors[i]});});
}
function drawNC(){
  if(!nCtx)return;const w=nCanvas.width,h=nCanvas.height;
  nCtx.fillStyle='rgba(6,13,26,0.1)';nCtx.fillRect(0,0,w,h);
  // Connections
  for(let i=0;i<hopNodes.length-1;i++){
    nCtx.beginPath();nCtx.moveTo(hopNodes[i].x,hopNodes[i].y);nCtx.lineTo(hopNodes[i+1].x,hopNodes[i+1].y);
    nCtx.strokeStyle='rgba(255,255,255,0.08)';nCtx.lineWidth=1;nCtx.stroke();
  }
  // Nodes
  hopNodes.forEach(n=>{
    nCtx.beginPath();nCtx.arc(n.x,n.y,14,0,Math.PI*2);
    nCtx.fillStyle=n.color+'30';nCtx.fill();nCtx.strokeStyle=n.color;nCtx.lineWidth=2;nCtx.stroke();
    nCtx.fillStyle='#fff';nCtx.font='8px Orbitron,monospace';nCtx.textAlign='center';
    nCtx.fillText(n.label,n.x,n.y+28);
  });
  // Latency hops
  if(Math.random()>0.85){
    const startIdx=0;
    hopParticles.push({idx:startIdx,t:0,speed:0.02+Math.random()*0.03,
      color:['#22c55e','#f59e0b','#ef4444'][Math.floor(Math.random()*3)]});
  }
  for(let i=hopParticles.length-1;i>=0;i--){
    const p=hopParticles[i];p.t+=p.speed;
    const segIdx=Math.floor(p.t*(hopNodes.length-1));
    const segT=(p.t*(hopNodes.length-1))-segIdx;
    if(segIdx>=hopNodes.length-1){hopParticles.splice(i,1);continue;}
    const a=hopNodes[segIdx],b=hopNodes[segIdx+1];
    const px=a.x+(b.x-a.x)*segT,py=a.y+(b.y-a.y)*segT;
    nCtx.beginPath();nCtx.arc(px,py,4,0,Math.PI*2);nCtx.fillStyle=p.color;nCtx.fill();
    nCtx.beginPath();nCtx.arc(px,py,7,0,Math.PI*2);nCtx.strokeStyle=p.color+'44';nCtx.lineWidth=1;nCtx.stroke();
  }
  // Latency graph (bottom)
  if(latencyData.length>120)latencyData.shift();
  latencyData.push(gameRunning?20+Math.random()*80:5+Math.random()*15);
  const gY=110,gH=h-gY-15;
  nCtx.strokeStyle='rgba(255,255,255,0.05)';nCtx.lineWidth=1;
  nCtx.beginPath();nCtx.moveTo(20,gY);nCtx.lineTo(w-20,gY);nCtx.stroke();
  if(latencyData.length>1){
    nCtx.beginPath();
    latencyData.forEach((v,i)=>{const x=20+(w-40)*(i/120),y=gY+gH-Math.min(v/100,1)*gH;i===0?nCtx.moveTo(x,y):nCtx.lineTo(x,y);});
    nCtx.strokeStyle='#3b82f688';nCtx.lineWidth=1.5;nCtx.stroke();
    nCtx.lineTo(20+(w-40),gY+gH);nCtx.lineTo(20,gY+gH);nCtx.fillStyle='rgba(59,130,246,0.05)';nCtx.fill();
  }
  const last=latencyData.length>0?latencyData[latencyData.length-1]:0;
  nCtx.fillStyle='rgba(255,255,255,0.3)';nCtx.font='8px monospace';nCtx.textAlign='left';
  nCtx.fillText('Latency: '+Math.round(last)+'ms | Hops: '+hopNodes.length+' | Packets: '+hopParticles.length,10,h-5);
  requestAnimationFrame(drawNC);
}
function initNC(){nCanvas=createNC();if(!nCanvas)return;nCtx=nCanvas.getContext('2d');initHops();drawNC();}
setTimeout(initNC,2000);
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
