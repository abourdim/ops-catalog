/**
 * WiFi Timeline — Event Reconstructor
 * Timeline canvas, event markers
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
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
    ...LANG_BASE.en,title:'WiFi Timeline — Event Reconstructor',subtitle:'Reconstruct wireless events in chronological order',disconnected:'Disconnected',connected:'Recording',mainSection:'Event Timeline',mainDesc:'Interactive canvas with chronological event markers',sectionA:'Event Log',sectionB:'Event Distribution',sectionC:'How It Works',start:'Record',stop:'Stop',totalEvents:'Events',howItWorksText:'WiFi event reconstruction places all captured wireless events on a chronological timeline. This forensic technique helps security analysts understand the sequence of events during an incident — when devices connected, when authentication occurred, when deauthentication attacks happened, and how data flow patterns changed over time. The timeline visualization makes it easy to spot anomalies and correlate events across multiple devices.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Click Record to start capturing events.',howto_2:'Watch events appear on the timeline canvas.',howto_3:'Hover over markers to see event details.',howto_4:'Check the Event Log for chronological list.',wiki_tl_title:'Timeline',wiki_tl:'Chronological event placement for forensic analysis.',wiki_forensics_title:'Forensics',wiki_forensics:'Event correlation helps identify attack patterns.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'WiFi Timeline ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Recording started',simStopped:'Recording stopped',newEvent:'Event recorded',step1Title:'Scan Airwaves',step1Desc:'WiFi adapter scans all channels to discover nearby access points and clients.',step2Title:'Identify Targets',step2Desc:'Detected devices are fingerprinted by MAC, SSID, signal strength, and encryption type.',step3Title:'Analyze Traffic',step3Desc:'Captured frames are decoded to reveal communication patterns and vulnerabilities.',step4Title:'Detect Threats',step4Desc:'Security analysis identifies rogue APs, weak encryption, and suspicious activity.',sectionCode:'Device Code',faq_q1:'What is WiFi Timeline — Event Reconstructor?',faq_a1:'WiFi Timeline — Event Reconstructor lets you interactive canvas with chronological event markers. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you wifi adapter scans all channels to discover nearby access points and clients. Then you detected devices are fingerprinted by mac, ssid, signal strength, and encryption type.',faq_q3:'What do the controls do?',faq_a3:'Click Record to start capturing events. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'ترتيب زمني للتحليل الجنائي.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need WiFi adapter. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Wifi Beacon Flood and Wifi Channel Heatmap. Each app in this category teaches a different aspect of WiFi reconnaissance.',demo_s1:'Welcome to WiFi Timeline — Event Reconstructor! Look at the main display — this is where the WiFi reconnaissance simulation runs.',demo_s2:'Click Record to start capturing events. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Event Log" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of WiFi reconnaissance.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how WiFi reconnaissance works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches WiFi reconnaissance concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Python (Scapy)',codeSnippet:'from scapy.all import *\\n\\ndef packet_handler(pkt):\\n    if pkt.haslayer(Dot11Beacon):\\n        ssid = pkt[Dot11Elt].info.decode(errors="ignore")\\n        bssid = pkt[Dot11].addr2\\n        channel = int(ord(pkt[Dot11Elt:3].info))\\n        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else "N/A"\\n        print(f"SSID: {ssid:30s}  BSSID: {bssid}  CH: {channel:2d}  Signal: {signal}")\\n\\nprint("Sniffing WiFi beacons... (requires monitor mode)")\\nsniff(iface="wlan0mon", prn=packet_handler, store=0)',codeExplain:'This script uses Scapy to capture WiFi beacon frames — the packets that access points broadcast every ~100ms to announce their presence. Each beacon contains the network name (SSID), MAC address (BSSID), channel number, and signal strength. Your WiFi adapter must be in monitor mode (airmon-ng start wlan0) to capture raw 802.11 frames.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Event Log" and "Event Distribution" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'WiFi Timeline — Reconstructeur',subtitle:'Reconstituez les evenements sans fil chronologiquement',disconnected:'Deconnecte',connected:'Enregistrement',mainSection:'Chronologie des Evenements',mainDesc:'Canvas interactif avec marqueurs chronologiques',sectionA:'Journal des Evenements',sectionB:'Distribution des Evenements',sectionC:'Comment ca marche',start:'Enregistrer',stop:'Arreter',totalEvents:'Evenements',howItWorksText:'La reconstruction d\'evenements WiFi place les evenements sur une chronologie. Cette technique forensique aide les analystes a comprendre les sequences d\'incidents.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Cliquez Enregistrer.',howto_2:'Observez la chronologie.',howto_3:'Survolez les marqueurs.',howto_4:'Consultez le journal.',wiki_tl_title:'Chronologie',wiki_tl:'Placement chronologique pour l\'analyse.',wiki_forensics_title:'Forensique',wiki_forensics:'Correlation des evenements.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Enregistrement demarre',simStopped:'Arrete',newEvent:'Evenement enregistre',step1Title:'Scanner les ondes',step1Desc:'L\'adaptateur WiFi scanne tous les canaux pour découvrir les points d\'accès.',step2Title:'Identifier les cibles',step2Desc:'Les appareils détectés sont identifiés par MAC, SSID et puissance du signal.',step3Title:'Analyser le trafic',step3Desc:'Les trames capturées sont décodées pour révéler les schémas de communication.',step4Title:'Détecter les menaces',step4Desc:'L\'analyse de sécurité identifie les AP pirates et les faiblesses.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule WiFi ! 🔬 Tu peux expérimenter avec WiFi signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais WiFi signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai wireless networks ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Wifi Beacon Flood and Wifi Deauth Detector ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
ar:{title:'الجدول الزمني WiFi — معيد بناء الأحداث',subtitle:'أعد بناء الأحداث اللاسلكية بالترتيب الزمني',disconnected:'غير متصل',connected:'تسجيل',mainSection:'الجدول الزمني للأحداث',mainDesc:'لوحة تفاعلية مع علامات زمنية',sectionA:'سجل الأحداث',sectionB:'توزيع الأحداث',sectionC:'كيف يعمل',start:'تسجيل',stop:'إيقاف',totalEvents:'أحداث',howItWorksText:'إعادة بناء أحداث WiFi تضع جميع الأحداث الملتقطة على جدول زمني. هذه التقنية الجنائية تساعد المحللين على فهم تسلسل الأحداث أثناء الحوادث.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'انقر تسجيل.',howto_2:'شاهد الأحداث على الجدول الزمني.',howto_3:'مرر فوق العلامات.',howto_4:'تحقق من سجل الأحداث.',wiki_tl_title:'الجدول الزمني',wiki_tl:'ترتيب زمني للتحليل الجنائي.',wiki_forensics_title:'التحليل الجنائي',wiki_forensics:'ربط الأحداث يكشف أنماط الهجوم.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'الجدول الزمني جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ التسجيل',simStopped:'توقف',newEvent:'حدث مسجل',step1Title:'مسح الموجات',step1Desc:'يفحص محول WiFi جميع القنوات لاكتشاف نقاط الوصول القريبة.',step2Title:'تحديد الأهداف',step2Desc:'يتم تحديد الأجهزة المكتشفة بواسطة MAC و SSID وقوة الإشارة.',step3Title:'تحليل حركة البيانات',step3Desc:'يتم فك تشفير الإطارات الملتقطة لكشف أنماط الاتصال.',step4Title:'كشف التهديدات',step4Desc:'يحدد التحليل الأمني نقاط الوصول المزيفة ونقاط الضعف.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي WiFi! 🔬 يمكنك التجربة مع WiFi signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج WiFi signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا wireless networks حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Wifi Beacon Flood and Wifi Deauth Detector! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`timeline-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — WiFi Timeline ═══════ */
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':')}
const EVENT_TYPES=[
  {type:'beacon',color:'#22c55e',label:'Beacon',yBand:0},
  {type:'probe',color:'#3b82f6',label:'Probe',yBand:1},
  {type:'auth',color:'#fbbf24',label:'Auth',yBand:2},
  {type:'deauth',color:'#ef4444',label:'Deauth',yBand:3},
  {type:'data',color:'#a855f7',label:'Data',yBand:4},
  {type:'assoc',color:'#06b6d4',label:'Assoc',yBand:5},
];
let simRunning=false,simInterval=null,events=[],startTime=0,counts={beacon:0,probe:0,auth:0,deauth:0,data:0,assoc:0};

function genEvent(){
  const def=EVENT_TYPES[Math.floor(Math.random()*EVENT_TYPES.length)];
  return{...def,time:Date.now(),timeStr:new Date().toLocaleTimeString(),src:randMAC(),dst:randMAC(),detail:`${def.label} frame: ${randMAC()} → ${randMAC()}`};
}

function drawTimeline(){
  const canvas=$('timelineCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(0,0,W,H);

  if(events.length===0)return;
  const tMin=events[0].time;const tMax=events[events.length-1].time;
  const tRange=Math.max(tMax-tMin,1000);
  const margin=30;const bandH=(H-margin*2)/6;

  // Grid lines for each band
  ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;
  for(let i=0;i<6;i++){
    const y=margin+i*bandH+bandH/2;
    ctx.beginPath();ctx.moveTo(margin,y);ctx.lineTo(W-margin,y);ctx.stroke();
  }

  // Time axis
  ctx.strokeStyle='rgba(255,255,255,.1)';
  ctx.beginPath();ctx.moveTo(margin,H-margin+5);ctx.lineTo(W-margin,H-margin+5);ctx.stroke();

  // Draw events
  const visibleEvents=events.slice(-200);
  visibleEvents.forEach(ev=>{
    const x=margin+((ev.time-tMin)/tRange)*(W-margin*2);
    const y=margin+ev.yBand*bandH+bandH/2;

    ctx.fillStyle=ev.color;
    ctx.globalAlpha=0.8;
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();

    // Glow
    ctx.globalAlpha=0.2;
    ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  });

  // Band labels
  ctx.font='9px monospace';ctx.textAlign='right';
  EVENT_TYPES.forEach((et,i)=>{
    ctx.fillStyle=et.color;
    ctx.fillText(et.label,margin-4,margin+i*bandH+bandH/2+3);
  });
}

function updateUI(){
  $('totalEvents').textContent=events.length;
  $('beaconCnt').textContent=counts.beacon;
  $('probeCnt').textContent=counts.probe;
  $('authCnt').textContent=counts.auth;
  $('deauthCnt').textContent=counts.deauth;
  $('dataCnt').textContent=counts.data;

  drawTimeline();

  // Event list
  const list=$('eventList');
  if(list){
    list.innerHTML='';
    events.slice(-40).reverse().forEach(ev=>{
      const e=document.createElement('div');e.className='ev-entry';
      e.innerHTML=`<span class="ev-dot ${ev.type}"></span><span class="ev-time">${ev.timeStr}</span><span class="ev-type" style="color:${ev.color}">${ev.label}</span><span style="font-size:.7rem;color:var(--text-muted)">${ev.src} → ${ev.dst}</span>`;
      list.appendChild(e);
    });
  }

  // Distribution
  const dist=$('eventDist');
  if(dist){
    const total=events.length||1;
    dist.innerHTML=EVENT_TYPES.map(et=>{
      const c=counts[et.type]||0;const pct=Math.round(c/total*100);
      return`<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span class="ev-dot ${et.type}"></span><span style="min-width:60px;font-weight:600">${et.label}</span><div style="flex:1;height:8px;border-radius:4px;background:rgba(0,0,0,.3)"><div style="height:100%;width:${pct}%;background:${et.color};border-radius:4px"></div></div><span style="min-width:50px;text-align:right">${c} (${pct}%)</span></div>`;
    }).join('');
  }
}

function addEvent(){
  const ev=genEvent();events.push(ev);counts[ev.type]=(counts[ev.type]||0)+1;
  log(`${LANG[currentLang].newEvent}: ${ev.label} ${ev.src}`,'rx');
  updateUI();
}

// Canvas hover for details
function initCanvasHover(){
  const canvas=$('timelineCanvas');if(!canvas)return;
  canvas.addEventListener('mousemove',e=>{
    if(events.length===0)return;
    const rect=canvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(canvas.width/rect.width);
    const my=(e.clientY-rect.top)*(canvas.height/rect.height);
    const tMin=events[0].time;const tMax=events[events.length-1].time;
    const tRange=Math.max(tMax-tMin,1000);const margin=30;const bandH=(canvas.height-margin*2)/6;

    let closest=null,minDist=20;
    events.slice(-200).forEach(ev=>{
      const x=margin+((ev.time-tMin)/tRange)*(canvas.width-margin*2);
      const y=margin+ev.yBand*bandH+bandH/2;
      const dist=Math.sqrt((mx-x)**2+(my-y)**2);
      if(dist<minDist){minDist=dist;closest=ev}
    });

    const detail=$('evDetail');
    if(closest&&detail){
      detail.style.display='block';
      detail.innerHTML=`<strong style="color:${closest.color}">${closest.label}</strong> at ${closest.timeStr}<br>${closest.src} → ${closest.dst}`;
    }else if(detail){detail.style.display='none'}
  });
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  events=[];counts={beacon:0,probe:0,auth:0,deauth:0,data:0,assoc:0};startTime=Date.now();
  const canvas=$('timelineCanvas');if(canvas){const ctx=canvas.getContext('2d');ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(0,0,canvas.width,canvas.height)}
  log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(()=>{const burst=1+Math.floor(Math.random()*3);for(let i=0;i<burst;i++)addEvent()},800);
}
function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();initCanvasHover();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS SIMULATION — 3D Perspective Event Waterfall ═══════ */
(function timelineWaterfallCanvas(){
  const CVS_ID='timelineWaterfallVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">⏱️</span> Event Waterfall</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const drops=[];let _raf=null,frameCount=0;
  const typeColors={beacon:'#22c55e',probe:'#3b82f6',auth:'#fbbf24',deauth:'#ef4444',data:'#a855f7',assoc:'#06b6d4'};
  const typeNames=Object.keys(typeColors);
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.15)';ctx.fillRect(0,0,w,h);
    frameCount++;
    // Spawn drops from sim events
    if(typeof simRunning!=='undefined'&&simRunning&&frameCount%4===0){
      const type=typeNames[Math.floor(Math.random()*typeNames.length)];
      const lane=typeNames.indexOf(type);
      drops.push({x:lane*(w/6)+w/12,y:-5,vy:1+Math.random()*1.5,type,
        r:2+Math.random()*3,alpha:1,trail:[]});
      if(drops.length>100)drops.splice(0,20);
    }
    // Column headers
    ctx.font='8px monospace';ctx.textAlign='center';
    typeNames.forEach((t,i)=>{
      ctx.fillStyle=typeColors[t]+'80';
      ctx.fillText(t.toUpperCase(),i*(w/6)+w/12,12);
      // Column line
      ctx.beginPath();ctx.moveTo(i*(w/6)+w/12,18);ctx.lineTo(i*(w/6)+w/12,h);
      ctx.strokeStyle=typeColors[t]+'10';ctx.lineWidth=1;ctx.stroke();
    });
    // Draw drops
    drops.forEach((d,i)=>{
      d.y+=d.vy;
      d.trail.push({x:d.x,y:d.y});
      if(d.trail.length>12)d.trail.shift();
      if(d.y>h+10){drops.splice(i,1);return;}
      const color=typeColors[d.type]||'#22c55e';
      // Trail
      d.trail.forEach((pt,ti)=>{
        ctx.beginPath();ctx.arc(pt.x,pt.y,d.r*(ti/d.trail.length)*0.6,0,Math.PI*2);
        ctx.fillStyle=color;ctx.globalAlpha=ti/d.trail.length*0.15;ctx.fill();
      });
      ctx.globalAlpha=1;
      // Main drop
      ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle=color+'cc';ctx.fill();
      // Glow
      ctx.beginPath();ctx.arc(d.x,d.y,d.r*2,0,Math.PI*2);
      ctx.fillStyle=color+'15';ctx.fill();
      // Ripple when reaching bottom
      if(d.y>h-30){
        const ripple=(d.y-(h-30))/30;
        ctx.beginPath();ctx.arc(d.x,h-10,ripple*20,0,Math.PI*2);
        ctx.strokeStyle=color;ctx.globalAlpha=(1-ripple)*0.3;ctx.lineWidth=1;ctx.stroke();
        ctx.globalAlpha=1;
      }
    });
    // Live event counter bars at bottom
    if(typeof counts!=='undefined'){
      const total=Object.values(counts).reduce((a,b)=>a+b,0)||1;
      let bx=0;
      typeNames.forEach(t=>{
        const pct=(counts[t]||0)/total;
        const bw=pct*w;
        ctx.fillStyle=typeColors[t]+'40';ctx.fillRect(bx,h-4,bw,4);
        bx+=bw;
      });
    }
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
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
