/**
 * Covert Exfil — WiFi Data Tunneling
 * DNS tunneling, ICMP covert channels, steganography simulation
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}

const LANG={
en:{title:'Covert Exfil — WiFi Data Tunneling',subtitle:'Data tunneling through WiFi channels',disconnected:'Disconnected',connected:'Exfiltrating',mainSection:'Covert Exfiltration',mainDesc:'DNS tunneling & steganography simulation',sectionA:'Packet Stream',sectionC:'How It Works',start:'Start',stop:'Stop',totalBytes:'Bytes Sent',packets:'Packets',throughput:'B/s',detection:'Detection',howItWorksText:'Covert exfiltration uses legitimate protocols to hide data transfers. DNS tunneling encodes data in DNS queries. ICMP covert channels embed data in ping packets. Steganography hides data within WiFi beacon frames. This simulation demonstrates these techniques for educational purposes.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Select an exfiltration method.',howto_2:'Click Start to begin.',howto_3:'Watch the data flow visualization.',howto_4:'Monitor the packet stream.',wiki_dns_title:'DNS Tunneling',wiki_dns:'Encodes data as DNS subdomains.',wiki_steg_title:'Steganography',wiki_steg:'Hides data within other data.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Covert Exfil ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Exfiltration started',simStopped:'Exfiltration stopped',pktSent:'Packet sent',riskLow:'Low',riskMed:'Medium',riskHigh:'High',step1Title:'Scan Airwaves',step1Desc:'WiFi adapter scans all channels to discover nearby access points and clients.',step2Title:'Identify Targets',step2Desc:'Detected devices are fingerprinted by MAC, SSID, signal strength, and encryption type.',step3Title:'Analyze Traffic',step3Desc:'Captured frames are decoded to reveal communication patterns and vulnerabilities.',step4Title:'Detect Threats',step4Desc:'Security analysis identifies rogue APs, weak encryption, and suspicious activity.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates WiFi! 🔬 You get to experiment with WiFi signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real WiFi signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real wireless networks! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Wifi Persona Builder and Wifi Rf Lineup! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
fr:{title:'Exfil Furtive — Tunnel WiFi',subtitle:'Tunnelisation de donnees via WiFi',disconnected:'Deconnecte',connected:'Exfiltration',mainSection:'Exfiltration Furtive',mainDesc:'Simulation tunnel DNS et steganographie',sectionA:'Flux de Paquets',sectionC:'Comment ca marche',start:'Demarrer',stop:'Arreter',totalBytes:'Octets',packets:'Paquets',throughput:'O/s',detection:'Detection',howItWorksText:'L\'exfiltration furtive utilise des protocoles legitimes pour cacher les transferts de donnees. Le tunneling DNS encode les donnees dans les requetes DNS.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Selectionnez une methode.',howto_2:'Cliquez Demarrer.',howto_3:'Observez le flux.',howto_4:'Surveillez les paquets.',wiki_dns_title:'Tunnel DNS',wiki_dns:'Encode les donnees en sous-domaines.',wiki_steg_title:'Steganographie',wiki_steg:'Cache des donnees dans d\'autres donnees.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Exfiltration demarree',simStopped:'Exfiltration arretee',pktSent:'Paquet envoye',riskLow:'Faible',riskMed:'Moyen',riskHigh:'Eleve',step1Title:'Scanner les ondes',step1Desc:'L\'adaptateur WiFi scanne tous les canaux pour découvrir les points d\'accès.',step2Title:'Identifier les cibles',step2Desc:'Les appareils détectés sont identifiés par MAC, SSID et puissance du signal.',step3Title:'Analyser le trafic',step3Desc:'Les trames capturées sont décodées pour révéler les schémas de communication.',step4Title:'Détecter les menaces',step4Desc:'L\'analyse de sécurité identifie les AP pirates et les faiblesses.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule WiFi ! 🔬 Tu peux expérimenter avec WiFi signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais WiFi signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai wireless networks ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Wifi Persona Builder and Wifi Rf Lineup ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
ar:{title:'تسريب خفي — نفق بيانات WiFi',subtitle:'تمرير البيانات عبر قنوات WiFi',disconnected:'غير متصل',connected:'تسريب',mainSection:'تسريب خفي',mainDesc:'محاكاة نفق DNS وإخفاء المعلومات',sectionA:'تدفق الحزم',sectionC:'كيف يعمل',start:'بدء',stop:'إيقاف',totalBytes:'بايت مرسل',packets:'حزم',throughput:'بايت/ث',detection:'كشف',howItWorksText:'التسريب الخفي يستخدم بروتوكولات شرعية لإخفاء نقل البيانات. نفق DNS يشفر البيانات في استعلامات DNS.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'اختر طريقة التسريب.',howto_2:'انقر بدء.',howto_3:'شاهد تدفق البيانات.',howto_4:'راقب الحزم.',wiki_dns_title:'نفق DNS',wiki_dns:'يشفر البيانات كنطاقات فرعية.',wiki_steg_title:'إخفاء المعلومات',wiki_steg:'يخفي البيانات في بيانات أخرى.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ التسريب',simStopped:'توقف التسريب',pktSent:'تم إرسال حزمة',riskLow:'منخفض',riskMed:'متوسط',riskHigh:'مرتفع',step1Title:'مسح الموجات',step1Desc:'يفحص محول WiFi جميع القنوات لاكتشاف نقاط الوصول القريبة.',step2Title:'تحديد الأهداف',step2Desc:'يتم تحديد الأجهزة المكتشفة بواسطة MAC و SSID وقوة الإشارة.',step3Title:'تحليل حركة البيانات',step3Desc:'يتم فك تشفير الإطارات الملتقطة لكشف أنماط الاتصال.',step4Title:'كشف التهديدات',step4Desc:'يحدد التحليل الأمني نقاط الوصول المزيفة ونقاط الضعف.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي WiFi! 🔬 يمكنك التجربة مع WiFi signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج WiFi signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا wireless networks حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Wifi Persona Builder and Wifi Rf Lineup! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
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
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`exfil-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Covert Exfil ═══════ */
let simRunning=false,simInterval=null,totalBytes=0,packetCount=0,startTime=0,currentMethod='dns';
const DOMAINS=['mail.google.com','cdn.cloudflare.com','api.github.com','update.microsoft.com','fonts.googleapis.com','static.amazon.com'];
let canvas,ctx,particles=[];

function randHex(n){let s='';for(let i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s}

function genPacket(){
  const sz=32+Math.floor(Math.random()*220);
  if(currentMethod==='dns'){
    const dom=DOMAINS[Math.floor(Math.random()*DOMAINS.length)];
    return {type:'DNS',data:`${randHex(12)}.${dom}`,size:sz};
  }else if(currentMethod==='icmp'){
    return {type:'ICMP',data:`echo req seq=${packetCount} data=${randHex(16)}`,size:sz};
  }else{
    return {type:'STEG',data:`beacon[${randHex(8)}] payload=${randHex(20)}`,size:sz};
  }
}

function initCanvas(){
  canvas=$('exfilCanvas');if(!canvas)return;
  ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;
  ctx.scale(2,2);
}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.offsetWidth,h=canvas.offsetHeight;
  ctx.fillStyle='rgba(10,10,26,0.15)';ctx.fillRect(0,0,w,h);
  const colors={dns:'#22c55e',icmp:'#3b82f6',steg:'#a855f7'};
  particles.forEach((p,i)=>{
    p.x+=p.vx;p.y+=p.vy;p.life-=0.01;
    if(p.life<=0){particles.splice(i,1);return;}
    ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    ctx.fillStyle=colors[p.method]||(colors.dns);ctx.globalAlpha=p.life*0.8;ctx.fill();ctx.globalAlpha=1;
    // draw connecting lines
    if(i>0&&i<particles.length){
      const prev=particles[i-1];
      ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x,p.y);
      ctx.strokeStyle=colors[p.method]||'#22c55e';ctx.globalAlpha=p.life*0.2;ctx.lineWidth=0.5;ctx.stroke();ctx.globalAlpha=1;
    }
  });
  // draw data flow arrow
  const t=(Date.now()%3000)/3000;
  const ax=t*w,ay=h/2+Math.sin(t*Math.PI*4)*20;
  ctx.beginPath();ctx.arc(ax,ay,4,0,Math.PI*2);ctx.fillStyle=colors[currentMethod];ctx.globalAlpha=0.9;ctx.fill();ctx.globalAlpha=1;
}

function addParticles(){
  const w=canvas?canvas.offsetWidth:300,h=canvas?canvas.offsetHeight:200;
  for(let i=0;i<3;i++){
    particles.push({x:Math.random()*w*0.2,y:h/2+Math.random()*40-20,vx:1+Math.random()*2,vy:(Math.random()-0.5)*0.5,r:2+Math.random()*3,life:1,method:currentMethod});
  }
  if(particles.length>200)particles.splice(0,50);
}

function updateUI(){
  $('totalBytes').textContent=totalBytes>1024?(totalBytes/1024).toFixed(1)+'K':totalBytes;
  $('packetCount').textContent=packetCount;
  const elapsed=(Date.now()-startTime)/1000;
  $('throughput').textContent=elapsed>0?Math.round(totalBytes/elapsed):'0';
  const risk=packetCount<20?'riskLow':packetCount<60?'riskMed':'riskHigh';
  $('detectionRisk').textContent=LANG[currentLang][risk];
  $('detectionRisk').style.color=risk==='riskLow'?'#22c55e':risk==='riskMed'?'#fbbf24':'#ef4444';
}

function addPacketToList(pkt){
  const list=$('packetList');if(!list)return;
  const d=document.createElement('div');d.className='packet-item';
  d.innerHTML=`<span class="pkt-type">${pkt.type}</span><span class="pkt-data">${pkt.data}</span><span class="pkt-size">${pkt.size}B</span>`;
  list.insertBefore(d,list.firstChild);
  if(list.children.length>100)list.removeChild(list.lastChild);
}

function simTick(){
  const pkt=genPacket();totalBytes+=pkt.size;packetCount++;
  addPacketToList(pkt);addParticles();updateUI();
  log(`${LANG[currentLang].pktSent}: ${pkt.type} ${pkt.size}B`,'tx');
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  totalBytes=0;packetCount=0;startTime=Date.now();particles=[];
  initCanvas();
  log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(simTick,600);
  requestAnimationFrame(function loop(){if(!simRunning)return;drawCanvas();requestAnimationFrame(loop)});
}

function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  // Method tabs
  document.querySelectorAll('.method-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.method-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');currentMethod=tab.dataset.method;playSound('click');
    });
  });
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS SIMULATION — Data Exfiltration Matrix ═══════ */
(function exfilMatrixCanvas(){
  const CVS_ID='exfilMatrixVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">🕵️</span> Exfiltration Data Matrix</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const columns=[];let _raf=null,frameCount=0;
  function initColumns(w){
    const numCols=Math.floor(w/14);
    while(columns.length<numCols){
      columns.push({chars:[],speed:0.5+Math.random()*2,y:-Math.random()*200});
    }
  }
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    frameCount++;
    initColumns(w);
    const methodColors={dns:'#22c55e',icmp:'#3b82f6',steg:'#a855f7'};
    const activeColor=methodColors[typeof currentMethod!=='undefined'?currentMethod:'dns']||'#22c55e';
    const isRunning=typeof simRunning!=='undefined'&&simRunning;
    // Matrix rain columns
    columns.forEach((col,i)=>{
      if(!isRunning){col.speed*=0.98;return;}
      col.y+=col.speed;
      if(col.y>h+20){col.y=-20;col.speed=0.5+Math.random()*2;}
      const x=i*14+7;
      // Leading bright character
      const ch='0123456789abcdef'[Math.floor(Math.random()*16)];
      ctx.font='10px monospace';ctx.fillStyle=activeColor;ctx.globalAlpha=0.9;ctx.textAlign='center';
      ctx.fillText(ch,x,col.y);
      // Trail
      for(let t=1;t<15;t++){
        const ty=col.y-t*12;if(ty<0)break;
        const tc='0123456789abcdef:./'[Math.floor(Math.random()*19)];
        ctx.globalAlpha=Math.max(0,0.5-t*0.04);
        ctx.fillStyle=activeColor;
        ctx.fillText(tc,x,ty);
      }
      ctx.globalAlpha=1;
    });
    // Data flow tunnel in center
    if(isRunning){
      const cx=w/2,tunnelW=w*0.6;
      // Source label
      ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.3)';ctx.textAlign='left';
      ctx.fillText('SOURCE',10,h/2-2);
      ctx.textAlign='right';ctx.fillText('EXFIL',w-10,h/2-2);
      // Tunnel
      ctx.beginPath();ctx.moveTo(w*0.15,h/2-15);ctx.lineTo(w*0.85,h/2-15);
      ctx.lineTo(w*0.85,h/2+15);ctx.lineTo(w*0.15,h/2+15);ctx.closePath();
      ctx.fillStyle=activeColor+'08';ctx.fill();
      ctx.strokeStyle=activeColor+'20';ctx.lineWidth=1;ctx.stroke();
      // Flowing data packets
      for(let p=0;p<8;p++){
        const t=((frameCount*3+p*40)%(w*0.7))/(w*0.7);
        const px=w*0.15+t*w*0.7;
        const py=h/2+Math.sin(t*Math.PI*6)*8;
        ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle=activeColor;ctx.globalAlpha=0.6;ctx.fill();
        // Packet label
        ctx.font='6px monospace';ctx.fillStyle=activeColor;ctx.globalAlpha=0.4;ctx.textAlign='center';
        const labels={dns:'DNS',icmp:'ICMP',steg:'STEG'};
        ctx.fillText(labels[typeof currentMethod!=='undefined'?currentMethod:'dns']||'DNS',px,py-6);
        ctx.globalAlpha=1;
      }
      // Throughput bar
      const bytes=typeof totalBytes!=='undefined'?totalBytes:0;
      const maxBytes=50000;const pct=Math.min(1,bytes/maxBytes);
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(10,h-15,w-20,8);
      ctx.fillStyle=activeColor+'80';ctx.fillRect(10,h-15,(w-20)*pct,8);
      ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.4)';ctx.textAlign='center';
      ctx.fillText((bytes>1024?(bytes/1024).toFixed(1)+'K':bytes)+' bytes exfiltrated',w/2,h-4);
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
