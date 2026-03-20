/**
 * Workshop DIY — Darknet Simulator v1.2
 * Onion Network — Safe sandbox with relay nodes, hidden services, deanonymization
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.42,152.87C187.48,152.74,187.66,152.63,187.82,152.63C188.09,152.63,190.48,151.54,191.62,150.9L194.17,149.21C197.43,146.97,199.24,146.24,202.59,145.78C203.8,145.62,204.63,145.62,205.93,145.78C212.62,146.63,217.42,150.72,219.33,157.2C219.72,158.55,219.77,162.69,219.41,163.88C218.19,167.86,216.58,170.3,213.79,172.41C209.46,175.7,203.83,176.56,198.81,174.72L187.29,168.46L187.31,160.79C187.32,156.56,187.37,153,187.42,152.87z"/><path style="stroke:none;fill:currentColor" d="M259.79,157.67L264.88,148.03L272.34,148.03L263.03,163.73L263.03,174.99L256.26,174.99L256.26,164.07L246.79,148.03L254.51,148.03z"/><path style="stroke:none;fill:currentColor" d="M240.37,152.74L236.5,152.74L236.5,170.28L240.37,170.28L240.37,174.99L225.85,174.99L225.85,170.28L229.72,170.28L229.72,152.74L225.85,152.74L225.85,148.03L240.37,148.03z"/><path style="stroke:none;fill:currentColor" d="M330.79,195.73L203.96,195.73L203.96,199.33L330.79,199.33z"/><path style="stroke:none;fill:currentColor" d="M330.79,203.35L161.69,203.35L161.69,206.96L330.79,206.96z"/><path style="stroke:none;fill:currentColor" d="M330.79,210.97L77.14,210.97L77.14,214.58L330.79,214.58z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6gMKAjgH2Wn1xgAAAAxJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAvBm8AAAB8IkWQwAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'Darknet Simulator',subtitle:'Safe sandbox: relay nodes, hidden services, deanonymization',disconnected:'Disconnected',connected:'Connected',mainSection:'Onion Network',mainDesc:'Build circuits through relay nodes',sectionA:'Onion Routing Reference',sectionB:'Anonymity Risks',sectionC:'Timing Attack Demo',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Build a circuit through 3 relays.',howto_2:'Create a hidden service.',howto_3:'Connect through the circuit.',howto_4:'Try timing attack in Section C.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'Trilingual.',wiki_log_title:'Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'Privacy',wiki_privacy:'Local-first.',working:'Working...',ready:'Darknet Simulator ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',newVersion:'UPDATE',langChanged:'Language > English',themeChanged:'Theme >',buildCircuit:'Build Circuit',createHS:'Create Hidden Service',connectHS:'Connect',resetBtn:'Reset',onionRefText:'Onion routing encrypts data in multiple layers. Each relay peels one layer, knowing only previous and next hop. Guard nodes know the client but not destination. Exit nodes see destination but not the client.',riskText:'Timing attacks correlate entry and exit traffic patterns. Malicious exit nodes can intercept unencrypted traffic.',timingText:'Simulate a timing attack to correlate entry and exit traffic.',timingBtn:'Run Timing Attack',building:'Building circuit...',circuitBuilt:'Circuit built through 3 relays!',creatingHS:'Creating hidden service...',hsCreated:'Hidden service created!',connecting:'Connecting through circuit...',connectionDone:'Connected to hidden service!',timingRunning:'Running timing attack...',timingDone:'Timing attack complete!',guard:'Guard',middle:'Middle',exit:'Exit',client:'Client',hiddenSvc:'Hidden Service',relay:'Relay',layer:'Layer',encrypted:'Encrypted',decrypted:'Decrypted',correlation:'Correlation',matched:'MATCHED - User deanonymized!',noMatch:'No correlation found - anonymity preserved',resetDone:'Network reset',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It lets you see how computer networks talk to each other! 🌐 Like X-ray vision for internet traffic.',faq_q2:'How does it work?',faq_a2:'The simulation shows real network protocols — the rules that computers follow to send data across the internet.',faq_q3:'What should I try first?',faq_a3:'Start a scan and watch the packets fly! 📡 Each colored packet is a different type of network message.',faq_q4:'What\'s the real science?',faq_a4:'This is how the entire internet works! TCP/IP, DNS, ARP — these protocols power every website you visit. 🌍',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See what happens when you inject bad packets or flood the network. That\'s network security! 🛡️',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Totally safe! 🛡️ This is a simulation — no real network traffic. Everything stays in your browser.',faq_q8:'What should I try next?',faq_a8:'Try Web Dns Odyssey and Web Mitm Sim! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',learnAge:'Ages:'},
  fr:{title:'Simulateur Darknet',subtitle:'Sandbox securise: relais, services caches, desanonymisation',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Reseau Onion',mainDesc:'Construire des circuits via relais',sectionA:'Reference Routage Onion',sectionB:'Risques d\'Anonymat',sectionC:'Demo Attaque Temporelle',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Construire un circuit a 3 relais.',howto_2:'Creer un service cache.',howto_3:'Se connecter via le circuit.',howto_4:'Essayer l\'attaque temporelle.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'Trilingue.',wiki_log_title:'Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Local-first.',working:'En cours...',ready:'Simulateur Darknet pret!',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',soundEffects:'Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',newVersion:'MAJ',langChanged:'Langue > Francais',themeChanged:'Theme >',buildCircuit:'Construire Circuit',createHS:'Creer Service Cache',connectHS:'Connecter',resetBtn:'Reinitialiser',onionRefText:'Le routage oignon chiffre les donnees en couches multiples. Chaque relais pele une couche.',riskText:'Les attaques temporelles correlent les motifs de trafic d\'entree et de sortie.',timingText:'Simuler une attaque temporelle.',timingBtn:'Lancer Attaque Temporelle',building:'Construction du circuit...',circuitBuilt:'Circuit construit via 3 relais!',creatingHS:'Creation du service cache...',hsCreated:'Service cache cree!',connecting:'Connexion via le circuit...',connectionDone:'Connecte au service cache!',timingRunning:'Attaque temporelle en cours...',timingDone:'Attaque terminee!',guard:'Garde',middle:'Milieu',exit:'Sortie',client:'Client',hiddenSvc:'Service Cache',relay:'Relais',layer:'Couche',encrypted:'Chiffre',decrypted:'Dechiffre',correlation:'Correlation',matched:'CORRESPONDANCE - Utilisateur desanonymise!',noMatch:'Pas de correlation - anonymat preserve',resetDone:'Reseau reinitialise',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Dns Odyssey and Web Mitm Sim ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{title:'محاكي الشبكة المظلمة',subtitle:'بيئة آمنة: عقد الترحيل والخدمات المخفية وكشف الهوية',disconnected:'غير متصل',connected:'متصل',mainSection:'شبكة البصل',mainDesc:'بناء دوائر عبر عقد الترحيل',sectionA:'مرجع توجيه البصل',sectionB:'مخاطر اخفاء الهوية',sectionC:'عرض هجوم التوقيت',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'بناء دائرة عبر 3 مرحلات.',howto_2:'انشاء خدمة مخفية.',howto_3:'الاتصال عبر الدائرة.',howto_4:'جرب هجوم التوقيت.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'الخصوصية',wiki_privacy:'محلي اولا.',working:'جار...',ready:'محاكي الشبكة المظلمة جاهز!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',soundEffects:'مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',newVersion:'تحديث',langChanged:'اللغة > العربية',themeChanged:'المظهر >',buildCircuit:'بناء دائرة',createHS:'انشاء خدمة مخفية',connectHS:'اتصال',resetBtn:'اعادة ضبط',onionRefText:'يشفر توجيه البصل البيانات في طبقات متعددة. كل مرحل يزيل طبقة واحدة.',riskText:'تربط هجمات التوقيت انماط حركة الدخول والخروج.',timingText:'محاكاة هجوم التوقيت.',timingBtn:'تشغيل هجوم التوقيت',building:'جاري بناء الدائرة...',circuitBuilt:'تم بناء الدائرة عبر 3 مرحلات!',creatingHS:'جاري انشاء الخدمة المخفية...',hsCreated:'تم انشاء الخدمة المخفية!',connecting:'جاري الاتصال عبر الدائرة...',connectionDone:'تم الاتصال بالخدمة المخفية!',timingRunning:'جاري هجوم التوقيت...',timingDone:'اكتمل هجوم التوقيت!',guard:'الحارس',middle:'الوسيط',exit:'المخرج',client:'العميل',hiddenSvc:'خدمة مخفية',relay:'مرحل',layer:'طبقة',encrypted:'مشفر',decrypted:'مفكك',correlation:'الارتباط',matched:'تطابق - تم كشف هوية المستخدم!',noMatch:'لا ارتباط - الهوية محفوظة',resetDone:'تم اعادة ضبط الشبكة',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Web Dns Odyssey and Web Mitm Sim! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};
/* ═══════ TEMPLATE BOILERPLATE ═══════ */
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(type==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logWithHistory(msg,type);applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
function checkVersion(){}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function pulseBismillah(type){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(type==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const logHistory=[];function logWithHistory(msg,type){logHistory.push({msg,type,ts:Date.now()});}function initTimeTravel(){document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='z'){const p=$('logPanel');if(!p||!p.classList.contains('open'))return;e.preventDefault();if(!logContainer)logContainer=$('logContainer');if(logContainer&&logContainer.lastChild){logContainer.removeChild(logContainer.lastChild);logHistory.pop();playSound('click');}}});}
let typewriterEnabled=true;async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function toggleWhisper(){}
function initGhostUsers(){const gc=document.createElement('canvas');gc.style.cssText='position:fixed;inset:0;z-index:9998;pointer-events:none;';document.body.appendChild(gc);const gctx=gc.getContext('2d');gc.width=innerWidth;gc.height=innerHeight;window.addEventListener('resize',()=>{gc.width=innerWidth;gc.height=innerHeight;});function draw(){gctx.clearRect(0,0,gc.width,gc.height);requestAnimationFrame(draw);}requestAnimationFrame(draw);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;if(breathingActive)bands.forEach(b=>b.classList.add('breathing'));else{bands.forEach(b=>b.classList.remove('breathing'));dhikrCount=0;}}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};let petState='idle',petIdleTimer=null,petSleepTimer=null;function initPixelPet(){const pet=document.createElement('div');pet.id='pixelPet';pet.className='pixel-pet pet-idle';pet.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;pet.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(pet,f.firstChild);}function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initLogoTracker(){const l=$('logoWrap');if(!l)return;document.addEventListener('mousemove',e=>{const r=l.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/(innerWidth/2);const dy=(e.clientY-(r.top+r.height/2))/(innerHeight/2);l.style.transform=`perspective(200px) rotateX(${dy*8}deg) rotateY(${-dx*8}deg)`;});}
function toggleMusicMode(){log('Music mode requires microphone','info');}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let dragging=false,startX,startW;h.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=p.offsetWidth;document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';document.body.style.userSelect='';});}
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(rid);if(b)b.focus();}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const target=$(id);if(target)target.classList.add('active');});});}function trapFocus(e){for(const id of['helpPanel','settingsPanel','logPanel']){const sb=$(id);if(!sb||!sb.classList.contains('open'))continue;const focusable=sb.querySelectorAll(FOCUSABLE);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#9c27b0';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initKonami(){const K=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let idx=0;document.addEventListener('keydown',e=>{if(e.key===K[idx]){idx++;if(idx===K.length){idx=0;setTheme('retro');log('KONAMI!','success');}}else idx=0;});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const p=$('debugPanel');if(p)p.classList.add('active');}

/* ══════════════════════════════════════════════════════════════
   APP-SPECIFIC: DARKNET SIMULATOR
   ══════════════════════════════════════════════════════════════ */
const RELAYS=[
  {id:0,label:'Guard-1',x:200,y:80,color:'#4fc3f7',type:'guard'},
  {id:1,label:'Guard-2',x:200,y:280,color:'#29b6f6',type:'guard'},
  {id:2,label:'Middle-1',x:350,y:120,color:'#ffa726',type:'middle'},
  {id:3,label:'Middle-2',x:350,y:240,color:'#ff9800',type:'middle'},
  {id:4,label:'Exit-1',x:500,y:80,color:'#ef5350',type:'exit'},
  {id:5,label:'Exit-2',x:500,y:280,color:'#e53935',type:'exit'},
];
const CLIENT_NODE={x:60,y:180,color:'#66bb6a',label:'client'};
const HS_NODE={x:640,y:180,color:'#9c27b0',label:'hiddenSvc'};
let onionCanvas,onionCtx,circuit=[],hasHS=false,isConnected=false;

function drawOnionNetwork(){
  if(!onionCtx)return;const c=onionCanvas,ctx=onionCtx,s=LANG[currentLang];
  ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#050810';ctx.fillRect(0,0,c.width,c.height);
  // Grid
  ctx.strokeStyle='rgba(156,39,176,0.06)';ctx.lineWidth=1;for(let x=0;x<c.width;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}for(let y=0;y<c.height;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
  // Circuit path
  if(circuit.length>0){
    const pts=[CLIENT_NODE,...circuit.map(i=>RELAYS[i]),hasHS?HS_NODE:null].filter(Boolean);
    ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
    for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);
    ctx.strokeStyle=isConnected?'rgba(156,39,176,0.5)':'rgba(76,175,80,0.3)';ctx.lineWidth=3;ctx.setLineDash([6,4]);ctx.stroke();ctx.setLineDash([]);
    // Encryption layers
    pts.forEach((pt,i)=>{if(i>0&&i<pts.length){const layers=pts.length-1-i;for(let l=0;l<layers;l++){ctx.beginPath();ctx.arc(pt.x,pt.y,32+l*6,0,Math.PI*2);ctx.strokeStyle=`hsla(${280-l*40},70%,50%,0.15)`;ctx.lineWidth=2;ctx.stroke();}}});
  }
  // Relays
  RELAYS.forEach(relay=>{
    const inCircuit=circuit.includes(relay.id);
    ctx.beginPath();ctx.arc(relay.x,relay.y,20,0,Math.PI*2);
    ctx.fillStyle=inCircuit?relay.color+'40':'rgba(255,255,255,0.03)';ctx.fill();
    ctx.strokeStyle=inCircuit?relay.color:'rgba(255,255,255,0.15)';ctx.lineWidth=inCircuit?2:1;ctx.stroke();
    ctx.fillStyle=inCircuit?'#fff':'rgba(255,255,255,0.4)';ctx.font='9px Orbitron,sans-serif';ctx.textAlign='center';ctx.fillText(relay.label,relay.x,relay.y+34);
    const icons={guard:'\uD83D\uDEE1',middle:'\uD83D\uDD00',exit:'\uD83D\uDEAA'};
    ctx.font='14px sans-serif';ctx.fillText(icons[relay.type]||'',relay.x,relay.y+5);
  });
  // Client
  ctx.beginPath();ctx.arc(CLIENT_NODE.x,CLIENT_NODE.y,22,0,Math.PI*2);ctx.fillStyle=CLIENT_NODE.color+'30';ctx.fill();ctx.strokeStyle=CLIENT_NODE.color;ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#fff';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('\uD83D\uDCBB',CLIENT_NODE.x,CLIENT_NODE.y+5);
  ctx.font='10px Orbitron';ctx.fillText(s[CLIENT_NODE.label]||'Client',CLIENT_NODE.x,CLIENT_NODE.y+38);
  // Hidden Service
  if(hasHS){
    ctx.beginPath();ctx.arc(HS_NODE.x,HS_NODE.y,22,0,Math.PI*2);ctx.fillStyle='rgba(156,39,176,0.2)';ctx.fill();ctx.strokeStyle='#9c27b0';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='14px sans-serif';ctx.fillText('\uD83C\uDF10',HS_NODE.x,HS_NODE.y+5);
    ctx.font='9px Orbitron';ctx.fillText('.onion',HS_NODE.x,HS_NODE.y+38);
    // Pulsing glow
    ctx.beginPath();ctx.arc(HS_NODE.x,HS_NODE.y,28+Math.sin(Date.now()/300)*4,0,Math.PI*2);ctx.strokeStyle='rgba(156,39,176,0.2)';ctx.lineWidth=2;ctx.stroke();
  }
}

function animateOnionPacket(fromPt,toPt,color,dur=500){
  return new Promise(resolve=>{
    const start=performance.now();
    function frame(now){
      const t=Math.min((now-start)/dur,1);drawOnionNetwork();
      const x=fromPt.x+(toPt.x-fromPt.x)*t;const y=fromPt.y+(toPt.y-fromPt.y)*t;
      onionCtx.beginPath();onionCtx.arc(x,y,6,0,Math.PI*2);onionCtx.fillStyle=color;onionCtx.fill();
      onionCtx.beginPath();onionCtx.arc(x,y,10,0,Math.PI*2);onionCtx.strokeStyle=color+'60';onionCtx.lineWidth=2;onionCtx.stroke();
      if(t<1)requestAnimationFrame(frame);else resolve();
    }
    requestAnimationFrame(frame);
  });
}

async function buildCircuit(){
  const s=LANG[currentLang];showToast(s.building);log(s.building,'tx');
  circuit=[];isConnected=false;
  // Pick one guard, one middle, one exit randomly
  const guards=RELAYS.filter(r=>r.type==='guard');const middles=RELAYS.filter(r=>r.type==='middle');const exits=RELAYS.filter(r=>r.type==='exit');
  const g=guards[Math.floor(Math.random()*guards.length)];
  const m=middles[Math.floor(Math.random()*middles.length)];
  const e=exits[Math.floor(Math.random()*exits.length)];
  // Animate building
  circuit.push(g.id);drawOnionNetwork();log(`${s.guard}: ${g.label}`,'info');await sleep(600);
  circuit.push(m.id);drawOnionNetwork();log(`${s.middle}: ${m.label}`,'info');await sleep(600);
  circuit.push(e.id);drawOnionNetwork();log(`${s.exit}: ${e.label}`,'info');await sleep(400);
  hideToast();log(s.circuitBuilt,'success');setStatus(true);
}

async function createHiddenService(){
  const s=LANG[currentLang];showToast(s.creatingHS);log(s.creatingHS,'tx');await sleep(1000);
  hasHS=true;drawOnionNetwork();
  const addr=Math.random().toString(36).substring(2,18)+'.onion';
  hideToast();log(`${s.hsCreated} ${addr}`,'success');
}

async function connectToHS(){
  if(circuit.length<3){log('Build a circuit first!','error');return;}
  if(!hasHS){log('Create a hidden service first!','error');return;}
  const s=LANG[currentLang];showToast(s.connecting);log(s.connecting,'tx');
  const pts=[CLIENT_NODE,...circuit.map(i=>RELAYS[i]),HS_NODE];
  for(let i=0;i<pts.length-1;i++){
    await animateOnionPacket(pts[i],pts[i+1],'#9c27b0',500);
    log(`${s.layer} ${i+1}: ${s.encrypted}`,'info');
  }
  isConnected=true;drawOnionNetwork();hideToast();log(s.connectionDone,'success');
}

async function runTimingAttack(){
  const s=LANG[currentLang];const el=$('timingResults');if(!el)return;
  showToast(s.timingRunning);log(s.timingRunning,'tx');
  await sleep(1500);
  const success=Math.random()>0.4;
  const color=success?'#ef5350':'#66bb6a';
  el.innerHTML=`<div style="background:var(--glass-bg,rgba(255,255,255,0.05));border:2px solid ${color}40;border-radius:12px;padding:1rem;">
    <h4 style="color:${color};margin:0 0 .5rem;">${s.correlation}</h4>
    <div style="font-size:.85rem;line-height:1.8;">
      <div>Entry traffic pattern: <span style="font-family:monospace;">[${Array.from({length:8},()=>Math.floor(Math.random()*100)).join(', ')}]</span></div>
      <div>Exit traffic pattern: <span style="font-family:monospace;">[${Array.from({length:8},()=>Math.floor(Math.random()*100)).join(', ')}]</span></div>
      <div style="margin-top:.5rem;font-weight:bold;color:${color};">${success?s.matched:s.noMatch}</div>
      ${success?'<div style="margin-top:.5rem;padding:.5rem;background:rgba(244,67,54,0.1);border-radius:4px;">Guard node: '+RELAYS[circuit[0]]?.label+' observed client IP</div>':''}
    </div>
  </div>`;
  el.style.display='block';hideToast();log(s.timingDone,success?'error':'success');
}

function resetOnionNetwork(){
  const s=LANG[currentLang];circuit=[];hasHS=false;isConnected=false;drawOnionNetwork();
  log(s.resetDone,'success');
}

function initDarknet(){
  onionCanvas=$('onionCanvas');if(onionCanvas){onionCtx=onionCanvas.getContext('2d');drawOnionNetwork();}
  const bcb=$('buildCircuitBtn');if(bcb)bcb.addEventListener('click',buildCircuit);
  const hsb=$('createHSBtn');if(hsb)hsb.addEventListener('click',createHiddenService);
  const cb=$('connectBtn');if(cb)cb.addEventListener('click',connectToHS);
  const rb=$('resetNetBtn');if(rb)rb.addEventListener('click',resetOnionNetwork);
  const tab=$('timingAttackBtn');if(tab)tab.addEventListener('click',runTimingAttack);
}

const styleTag=document.createElement('style');styleTag.textContent=`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;document.head.appendChild(styleTag);

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
  initDarknet();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Anonymity Entropy Monitor ═══════ */
(function(){
let aCanvas,aCtx;const aParticles=[];let entropyLevel=0.5;const entropyHistory=[];
function createAC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Anonymity Entropy Monitor</div>';
  const c=document.createElement('canvas');c.width=620;c.height=250;
  c.style.cssText='width:100%;height:auto;display:block;background:#050810;cursor:pointer;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawAC(){
  if(!aCtx)return;const w=aCanvas.width,h=aCanvas.height;
  aCtx.fillStyle='rgba(5,8,16,0.1)';aCtx.fillRect(0,0,w,h);
  // Entropy based on circuit state
  const targetEntropy=circuit.length===3?(isConnected?0.9:0.7):0.3;
  entropyLevel+=(targetEntropy-entropyLevel)*0.02;
  if(entropyHistory.length>200)entropyHistory.shift();
  entropyHistory.push(entropyLevel);
  // Entropy wave
  const waveY=h*0.45;
  aCtx.beginPath();
  for(let x=0;x<w;x++){
    const idx=Math.floor(x/w*entropyHistory.length);
    const val=entropyHistory[Math.min(idx,entropyHistory.length-1)]||0.5;
    const y=waveY+Math.sin(x*0.03+Date.now()/500)*20*val+Math.sin(x*0.07-Date.now()/300)*10*val;
    x===0?aCtx.moveTo(x,y):aCtx.lineTo(x,y);
  }
  aCtx.strokeStyle='rgba(156,39,176,0.6)';aCtx.lineWidth=2;aCtx.stroke();
  // Fill below wave
  aCtx.lineTo(w,h);aCtx.lineTo(0,h);aCtx.closePath();
  aCtx.fillStyle='rgba(156,39,176,0.05)';aCtx.fill();
  // Particles (noise dots)
  if(Math.random()<entropyLevel*0.5){
    aParticles.push({x:Math.random()*w,y:Math.random()*h,life:1,size:1+Math.random()*3,
      color:['#9c27b0','#4fc3f7','#66bb6a','#ffa726'][Math.floor(Math.random()*4)]});
  }
  for(let i=aParticles.length-1;i>=0;i--){
    const p=aParticles[i];p.life-=0.015;
    if(p.life<=0){aParticles.splice(i,1);continue;}
    aCtx.globalAlpha=p.life*0.5;aCtx.beginPath();aCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
    aCtx.fillStyle=p.color;aCtx.fill();aCtx.globalAlpha=1;
  }
  // Entropy gauge (right side)
  const gx=w-60,gy=30,gw=30,gh=h-60;
  aCtx.fillStyle='rgba(255,255,255,0.03)';aCtx.fillRect(gx,gy,gw,gh);
  const gFill=entropyLevel*gh;
  const gColor=entropyLevel>0.7?'#66bb6a':entropyLevel>0.4?'#ffa726':'#ef5350';
  aCtx.fillStyle=gColor+'44';aCtx.fillRect(gx,gy+gh-gFill,gw,gFill);
  aCtx.strokeStyle=gColor+'66';aCtx.lineWidth=1;aCtx.strokeRect(gx,gy,gw,gh);
  aCtx.fillStyle=gColor;aCtx.font='10px Orbitron,sans-serif';aCtx.textAlign='center';
  aCtx.fillText(Math.round(entropyLevel*100)+'%',gx+gw/2,gy-5);
  aCtx.fillStyle='rgba(255,255,255,0.3)';aCtx.font='7px monospace';
  aCtx.fillText('Entropy',gx+gw/2,gy+gh+12);
  // Status
  aCtx.fillStyle='rgba(255,255,255,0.4)';aCtx.font='8px monospace';aCtx.textAlign='left';
  const status=entropyLevel>0.7?'HIGH ANONYMITY':entropyLevel>0.4?'MODERATE RISK':'LOW ANONYMITY';
  aCtx.fillText('Circuit: '+(circuit.length===3?'BUILT':'NONE')+' | HS: '+(hasHS?'ACTIVE':'NONE')+' | '+status,10,h-8);
  requestAnimationFrame(drawAC);
}
function initAC(){aCanvas=createAC();if(!aCanvas)return;aCtx=aCanvas.getContext('2d');
  aCanvas.addEventListener('click',()=>{for(let i=0;i<20;i++)aParticles.push({x:Math.random()*aCanvas.width,y:Math.random()*aCanvas.height,life:1,size:2+Math.random()*4,color:'#9c27b0'});});
  drawAC();}
setTimeout(initAC,2000);
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
