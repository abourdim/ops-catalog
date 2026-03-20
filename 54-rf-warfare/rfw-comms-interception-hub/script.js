/**
 * Workshop DIY — Comms Interception Hub v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}
const LANG={
  en:{title:'Comms Interception Hub',subtitle:'Comms Interception Hub',disconnected:'Idle',connected:'Intercepting',mainSection:'Communications Interception Hub',mainDesc:'SIGINT collection, signal analysis and traffic monitoring',sectionA:'Intercepted Channels',sectionB:'SIGINT Methods',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Tune receiver frequency.',howto_2:'Set bandwidth and modulation.',howto_3:'Start intercepting signals.',howto_4:'Use Auto-Scan to find channels.',working:'Working...',ready:'Interception Hub ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startIntercept:'Start Intercept',stopIntercept:'Stop Intercept',autoScan:'Auto-Scan',resetSim:'Reset',rxParams:'Receiver Settings',analysisParams:'Analysis',rxFreq:'Tune Freq (MHz):',rxBw:'RX Bandwidth (kHz):',modType:'Modulation:',squelch:'Squelch:',hubStatus:'Hub Status',channelHint:'Detected communications channels.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF warfare! 🔬 You get to experiment with electronic warfare signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real electronic warfare signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real electromagnetic combat techniques! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Rfw Gps Spoofing Sim and Rfw Frequency Deconfliction! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
  fr:{title:'Hub Interception Comms',subtitle:'Hub Interception Comms',disconnected:'Inactif',connected:'Interception',mainSection:'Hub d\'Interception Communications',mainDesc:'Collecte SIGINT et analyse du trafic',sectionA:'Canaux Interceptes',sectionB:'Methodes SIGINT',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Regler la frequence.',howto_2:'Configurer bande passante.',howto_3:'Demarrer l\'interception.',howto_4:'Scanner automatiquement.',working:'En cours...',ready:'Hub pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startIntercept:'Demarrer Interception',stopIntercept:'Arreter',autoScan:'Auto-Scan',resetSim:'Reinitialiser',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Gps Spoofing Sim and Rfw Frequency Deconfliction ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'\u0645\u0631\u0643\u0632 \u0627\u0639\u062a\u0631\u0627\u0636 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',subtitle:'\u0645\u0631\u0643\u0632 \u0627\u0639\u062a\u0631\u0627\u0636 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0627\u0639\u062a\u0631\u0627\u0636',mainSection:'\u0645\u0631\u0643\u0632 \u0627\u0639\u062a\u0631\u0627\u0636 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',mainDesc:'\u062c\u0645\u0639 \u0627\u0644\u0627\u0633\u062a\u062e\u0628\u0627\u0631\u0627\u062a \u0648\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a',sectionA:'\u0627\u0644\u0642\u0646\u0648\u0627\u062a \u0627\u0644\u0645\u0639\u062a\u0631\u0636\u0629',sectionB:'\u0637\u0631\u0642 SIGINT',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u0631\u0643\u0632 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startIntercept:'\u0628\u062f\u0621 \u0627\u0644\u0627\u0639\u062a\u0631\u0627\u0636',stopIntercept:'\u0625\u064a\u0642\u0627\u0641',autoScan:'\u0641\u062d\u0635 \u062a\u0644\u0642\u0627\u0626\u064a',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Gps Spoofing Sim and Rfw Frequency Deconfliction! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sigint-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ SIGINT DATA ═══════ */
let intercepting=false,autoScanning=false,time=0;
let channels=[];let trafficHistory=new Array(300).fill(0);

function initChannels(){channels=[];const types=['Voice','Data','Telemetry','Beacon','Burst','FHSS','OFDM','CW'];for(let i=0;i<10;i++){channels.push({id:'CH-'+(i+1),freq:(100+Math.random()*5900).toFixed(1),type:types[Math.floor(Math.random()*types.length)],power:(-80+Math.random()*50).toFixed(0),active:Math.random()>0.3,intercepted:false,traffic:0});}}

function drawSigint(){
  const c=$('sigintCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Grid
  for(let i=0;i<=12;i++){const x=i*W/12;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText((i*500)+'',x,H-3);}
  for(let i=0;i<=6;i++){const y=i*H/6;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.stroke();}

  // Noise floor
  ctx.beginPath();for(let x=0;x<W;x++){const nf=H*0.8+Math.random()*10-5;if(x===0)ctx.moveTo(x,nf);else ctx.lineTo(x,nf);}ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1;ctx.stroke();

  // Channel signals
  const tuneFreq=parseFloat($('freqInput')?.value||900);const rxBw=parseFloat($('bwInput')?.value||25);
  channels.forEach(ch=>{
    if(!ch.active)return;
    const fx=(parseFloat(ch.freq)/6000)*W;const sigH=(parseFloat(ch.power)+100)/120*H*0.6;
    ctx.beginPath();const w=10+Math.random()*10;
    ctx.moveTo(fx-w,H*0.8);ctx.quadraticCurveTo(fx,H*0.8-sigH,fx+w,H*0.8);
    ctx.strokeStyle=ch.intercepted?'rgba(0,255,136,0.8)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
    if(ch.intercepted){ctx.fillStyle='rgba(0,255,136,0.1)';ctx.fill();}
    ctx.fillStyle=ch.intercepted?'#00ff88':'#66ccff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(ch.id+' '+ch.type,fx,H*0.8-sigH-6);
  });

  // Tuning indicator
  const tuneX=(tuneFreq/6000)*W;const bwW=(rxBw/1000/6000)*W*50;
  ctx.fillStyle='rgba(255,200,0,0.1)';ctx.fillRect(tuneX-bwW,0,bwW*2,H);
  ctx.beginPath();ctx.moveTo(tuneX,0);ctx.lineTo(tuneX,H);ctx.strokeStyle='rgba(255,200,0,0.5)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,200,0,0.6)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(tuneFreq+' MHz',tuneX,15);

  // Auto-scan sweep
  if(autoScanning){const sweepX=(time*60%W);ctx.beginPath();ctx.moveTo(sweepX,0);ctx.lineTo(sweepX,H);ctx.strokeStyle='rgba(0,255,136,0.4)';ctx.lineWidth=2;ctx.stroke();}

  // Check interceptions
  if(intercepting){channels.forEach(ch=>{const dist=Math.abs(parseFloat(ch.freq)-tuneFreq);ch.intercepted=dist<rxBw*2&&ch.active;if(ch.intercepted)ch.traffic+=Math.random()*5;});}else{channels.forEach(ch=>ch.intercepted=false);}

  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('SIGINT SPECTRUM — 0 to 6 GHz',10,18);
  if(intercepting){ctx.fillStyle='rgba(0,255,136,0.8)';ctx.fillText('INTERCEPTING @ '+tuneFreq+' MHz',10,34);}
}

function drawTraffic(){
  const c=$('trafficCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const intCount=channels.filter(c=>c.intercepted).length;
  const newVal=intercepting?intCount*10+Math.random()*20:Math.random()*2;
  trafficHistory.push(newVal);if(trafficHistory.length>300)trafficHistory.shift();
  // Bar chart style
  const barW=W/300;
  trafficHistory.forEach((v,i)=>{const bh=v/80*H*0.8;ctx.fillStyle=v>40?'rgba(0,255,136,0.7)':v>20?'rgba(0,200,255,0.6)':'rgba(100,100,100,0.3)';ctx.fillRect(i*barW,H-bh,barW-1,bh);});
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('TRAFFIC ACTIVITY',5,14);
}

function animate(){time+=0.016;drawSigint();drawTraffic();updateStats();requestAnimationFrame(animate);}
function updateStats(){const stats=$('hubStats');if(!stats)return;const intCount=channels.filter(c=>c.intercepted).length;const activeCount=channels.filter(c=>c.active).length;stats.innerHTML='<b>Channels:</b> '+activeCount+' active<br><b>Intercepted:</b> '+intCount+'<br><b>Auto-Scan:</b> '+(autoScanning?'<span style="color:#ffcc00">ON</span>':'OFF')+'<br><b>Status:</b> '+(intercepting?'<span style="color:#00ff88">INTERCEPTING</span>':'<span style="color:#888">STANDBY</span>');}
function updateChannelList(){const lib=$('channelList');if(!lib)return;lib.innerHTML='';channels.forEach(ch=>{if(!ch.active)return;const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(ch.intercepted?'rgba(0,255,136,0.08)':'rgba(0,200,255,0.05)');row.innerHTML='<span style="color:'+(ch.intercepted?'#00ff88':'#66ccff')+'">'+ch.id+'</span><span>'+ch.freq+' MHz</span><span>'+ch.type+'</span><span>'+ch.power+' dBm</span><span style="color:'+(ch.intercepted?'#00ff88':'#888')+'">'+(ch.intercepted?'CAPTURED':'---')+'</span>';lib.appendChild(row);});}
function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>COMINT:</b> Communications Intelligence — intercepting voice and data.','<b>ELINT:</b> Electronic Intelligence — analyzing radar and sensor emissions.','<b>Direction Finding:</b> Locating transmitters via signal triangulation.','<b>Traffic Analysis:</b> Studying communication patterns without content.','<b>Demodulation:</b> Extracting information from modulated signals.','<b>Frequency Hopping:</b> Tracking signals across frequency changes.'].join('<br><br>');}

function initControls(){
  $('freqInput').oninput=()=>{$('freqLabel').textContent=$('freqInput').value+' MHz';};
  $('bwInput').oninput=()=>{$('bwLabel').textContent=$('bwInput').value+' kHz';};
  $('squelchInput').oninput=()=>{$('squelchLabel').textContent=$('squelchInput').value+'%';};
  $('interceptBtn').onclick=()=>{intercepting=!intercepting;setStatus(intercepting);$('interceptBtn').querySelector('[data-i18n]').textContent=intercepting?LANG[currentLang].stopIntercept:LANG[currentLang].startIntercept;log(intercepting?'Interception STARTED @ '+$('freqInput').value+' MHz':'Interception STOPPED',intercepting?'rx':'info');if(intercepting)showToast('Intercepting...',2000);};
  $('scanBtn').onclick=()=>{autoScanning=!autoScanning;log(autoScanning?'Auto-scan ENABLED':'Auto-scan DISABLED',autoScanning?'success':'info');if(autoScanning){let scanIdx=0;const interval=setInterval(()=>{if(!autoScanning){clearInterval(interval);return;}const freq=100+scanIdx*50;$('freqInput').value=freq;$('freqLabel').textContent=freq+' MHz';scanIdx++;if(scanIdx>118)scanIdx=0;},200);}playSound(autoScanning?'success':'click');};
  $('resetBtn').onclick=()=>{intercepting=false;autoScanning=false;setStatus(false);initChannels();trafficHistory=new Array(300).fill(0);$('interceptBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startIntercept;log('Reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initChannels();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateChannelList,1000);
});

/* ═══════ ENHANCED RF CANVAS — COMMS INTERCEPTION HUB ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _modHistory=[];let _bitstream=new Array(400).fill(0);
let _directionBearings=[];let _dataRate=new Array(200).fill(0);

/* ── Modulation Analysis View ── */
function drawModAnalysis(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DEMODULATION — SIGNAL ANALYSIS',5,12);
  const isInt=typeof intercepting!=='undefined'&&intercepting;
  const mod=_$('modSelect')?.value||'AM';
  // Time domain waveform
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const t=x/W*20;let y=H/2;
    if(mod==='AM')y=H/2+Math.sin(t*10)*(15+10*Math.sin(t*1.5))+Math.random()*(isInt?2:8);
    else if(mod==='FM')y=H/2+Math.sin(t*10+5*Math.sin(t*2))*20+Math.random()*(isInt?2:8);
    else if(mod==='PSK')y=H/2+Math.sin(t*10+(Math.floor(t*3)%2)*Math.PI)*18+Math.random()*(isInt?2:8);
    else y=H/2+Math.sin(t*8)*15+Math.random()*5;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=isInt?'rgba(0,255,136,0.7)':'rgba(0,200,255,0.4)';ctx.lineWidth=1;ctx.stroke();
  // Mod type label
  ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(mod+' DEMOD',W-10,25);
  if(isInt){ctx.fillStyle='rgba(0,255,136,0.4)';ctx.fillText('LOCKED',W-10,38);}
}

/* ── Direction Finding Compass ── */
function drawDFCompass(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DIRECTION FINDING',5,12);
  const cx=W/2,cy=H/2+5,R=Math.min(W,H)/2-22;
  for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/3,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText('N',cx,cy-R-3);ctx.fillText('S',cx,cy+R+9);ctx.fillText('E',cx+R+7,cy+3);ctx.fillText('W',cx-R-7,cy+3);
  const isInt=typeof intercepting!=='undefined'&&intercepting;
  if(isInt&&typeof channels!=='undefined'){
    channels.forEach((ch,i)=>{
      if(!ch.intercepted)return;
      const bearing=(i*50+30+Math.sin(_t+i)*5)*Math.PI/180-Math.PI/2;
      const dist=0.4+Math.random()*0.4;
      const bx=cx+Math.cos(bearing)*dist*R;const by=cy+Math.sin(bearing)*dist*R;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(bx,by);
      ctx.strokeStyle='rgba(0,255,136,0.5)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(bx,by,5,0,Math.PI*2);ctx.fillStyle='rgba(0,255,136,0.8)';ctx.fill();
      ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='7px Orbitron,monospace';ctx.fillText(ch.id,bx,by-8);
    });
  }
  ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.8)';ctx.fill();
}

/* ── Bitstream Visualization ── */
function drawBitstream(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('INTERCEPTED BITSTREAM',5,12);
  const isInt=typeof intercepting!=='undefined'&&intercepting;
  if(isInt&&_t%0.05<0.02){_bitstream.push(Math.random()>0.5?1:0);if(_bitstream.length>400)_bitstream.shift();}
  const bitW=W/50;const rows=Math.floor((H-25)/14);
  for(let r=0;r<rows;r++){for(let c=0;c<50;c++){
    const idx=r*50+c;if(idx>=_bitstream.length)break;
    const x=c*bitW;const y=22+r*14;
    ctx.fillStyle=_bitstream[idx]?'rgba(0,255,136,'+(isInt?0.6:0.15)+')':'rgba(0,100,200,'+(isInt?0.3:0.08)+')';
    ctx.fillRect(x,y,bitW-1,12);
    if(isInt){ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText(_bitstream[idx],x+bitW/2,y+10);}
  }}
}

/* ── Data Rate Monitor ── */
function drawDataRate(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DATA THROUGHPUT (kbps)',5,12);
  const isInt=typeof intercepting!=='undefined'&&intercepting;
  const intCount=typeof channels!=='undefined'?channels.filter(c=>c.intercepted).length:0;
  const rate=isInt?intCount*15+Math.random()*20:Math.random()*2;
  _dataRate.push(rate);if(_dataRate.length>200)_dataRate.shift();
  // Bar chart
  const barW=W/200;
  _dataRate.forEach((v,i)=>{const bh=v/100*(H-25);
    ctx.fillStyle=v>50?'rgba(0,255,136,0.5)':v>20?'rgba(0,200,255,0.4)':'rgba(100,100,100,0.2)';
    ctx.fillRect(i*barW,H-10-bh,barW,bh);});
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='12px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(rate.toFixed(0)+' kbps',W-10,28);
}

/* ── Frequency Activity Matrix ── */
function drawFreqActivityMatrix(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('FREQUENCY ACTIVITY MATRIX',5,12);
  const isInt=typeof intercepting!=='undefined'&&intercepting;
  const cols=60;const rows=20;const cellW=W/cols;const cellH=(H-25)/rows;
  for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){
    let activity=Math.random()*10;
    if(isInt&&typeof channels!=='undefined'){
      channels.forEach(ch=>{if(ch.active){const chCol=Math.floor(parseFloat(ch.freq)/6000*cols);
        if(Math.abs(c-chCol)<2)activity+=40+Math.random()*30;}});}
    const norm=Math.min(1,activity/80);
    const g=Math.floor(norm*255);const b=Math.floor((1-norm)*200);
    ctx.fillStyle='rgba(0,'+g+','+b+','+(0.2+norm*0.5)+')';
    ctx.fillRect(c*cellW,20+r*cellH,cellW-0.5,cellH-0.5);
  }}
}

function enhancedRender(){
  _t+=0.016;
  const sc=_$('sigintCanvas');
  if(sc){const ctx=sc.getContext('2d');drawDFCompass(ctx,sc.width,sc.height);}
  const tc=_$('trafficCanvas');
  if(tc){const ctx=tc.getContext('2d');const W=tc.width,H=tc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawDataRate(ctx,W,H);}
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
