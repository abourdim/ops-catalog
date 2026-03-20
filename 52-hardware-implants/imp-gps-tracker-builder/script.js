/**
 * imp-gps-tracker-builder — Workshop DIY
 * Covert GPS tracker builder simulation for counter-surveillance training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="40" r="20" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="40" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="50" cy="40" r="3" fill="currentColor"/><path d="M50 60 L50 80 L40 90 L60 90 L50 80" fill="none" stroke="currentColor" stroke-width="2"/><line x1="30" y1="40" x2="20" y2="40" stroke="currentColor" stroke-width="1.5"/><line x1="70" y1="40" x2="80" y2="40" stroke="currentColor" stroke-width="1.5"/><line x1="50" y1="20" x2="50" y2="10" stroke="currentColor" stroke-width="1.5"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

const LANG={
  en:{title:'imp-gps-tracker-builder',subtitle:'📍 track · 📡 report · 🛡️ detect',disconnected:'Disconnected',connected:'Connected',mainSection:'GPS Tracker Builder — Covert Tracking Lab',mainDesc:'Build covert GPS trackers and learn vehicle/asset tracking detection',sectionA:'How It Works',sectionB:'Lab — Satellite Map Visualizer',sectionC:'Challenge',trackBtn:'Start Tracking',reportBtn:'Get Location',detectBtn:'Detect Tracker',howStep1:'Covert GPS trackers use GPS/GLONASS/Galileo satellites to determine position with meter-level accuracy.',howStep2:'Position data is transmitted via GSM/4G cellular or satellite modem to a remote monitoring server.',howStep3:'Magnetic mount trackers can be hidden under vehicles — powered by lithium batteries lasting weeks to months.',howStep4:'Detection uses RF scanning for cellular emissions, physical inspection, and GPS jamming detection.',ready:'📍 GPS Tracker Builder ready — select tracker type!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip',step1Title:'Design Implant',step1Desc:'Covert GPS trackers use GPS/GLONASS/Galileo satellites to determine position with meter-level accuracy.',step2Title:'Build & Program',step2Desc:'Position data is transmitted via GSM/4G cellular or satellite modem to a remote monitoring server.',step3Title:'Deploy',step3Desc:'Magnetic mount trackers can be hidden under vehicles — powered by lithium batteries lasting weeks to months.',step4Title:'Monitor & Extract',step4Desc:'Detection uses RF scanning for cellular emissions, physical inspection, and GPS jamming detection.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates hardware implants! 🔬 You get to experiment with covert hardware devices in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real covert hardware devices so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real physical security and implant design! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Imp Pi Zero Dropbox and Imp Evil Maid Toolkit! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr:{title:'imp-gps-tracker-builder',subtitle:'📍 pister · 📡 rapporter · 🛡️ détecter',disconnected:'Déconnecté',connected:'Connecté',mainSection:'Constructeur de traceur GPS',mainDesc:'Construisez des traceurs GPS cachés et apprenez la détection',sectionA:'Comment ça marche',sectionB:'Labo — Carte satellite',sectionC:'Défi',trackBtn:'Pister',reportBtn:'Localiser',detectBtn:'Détecter',ready:'📍 Traceur GPS prêt !',logCleared:'Journal effacé',copied:'Copié !',working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer',step1Title:'Concevoir l\'implant',step1Desc:'Covert GPS trackers use GPS/GLONASS/Galileo satellites to determine position with meter-level accuracy.',step2Title:'Construire et programmer',step2Desc:'Position data is transmitted via GSM/4G cellular or satellite modem to a remote monitoring server.',step3Title:'Déployer',step3Desc:'Magnetic mount trackers can be hidden under vehicles — powered by lithium batteries lasting weeks to months.',step4Title:'Surveiller et extraire',step4Desc:'Detection uses RF scanning for cellular emissions, physical inspection, and GPS jamming detection.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule hardware implants ! 🔬 Tu peux expérimenter avec covert hardware devices en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais covert hardware devices.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai physical security and implant design ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Imp Pi Zero Dropbox and Imp Evil Maid Toolkit ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar:{title:'imp-gps-tracker-builder',subtitle:'📍 تتبع · 📡 تقرير · 🛡️ كشف',disconnected:'غير متصل',connected:'متصل',mainSection:'مُنشئ متتبع GPS — مختبر التتبع السري',mainDesc:'بناء متتبعات GPS مخفية وتعلم كشف أجهزة التتبع',sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',trackBtn:'تتبع',reportBtn:'موقع',detectBtn:'كشف',ready:'📍 متتبع GPS جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي',step1Title:'تصميم الزرع',step1Desc:'Covert GPS trackers use GPS/GLONASS/Galileo satellites to determine position with meter-level accuracy.',step2Title:'بناء وبرمجة',step2Desc:'Position data is transmitted via GSM/4G cellular or satellite modem to a remote monitoring server.',step3Title:'نشر',step3Desc:'Magnetic mount trackers can be hidden under vehicles — powered by lithium batteries lasting weeks to months.',step4Title:'مراقبة واستخراج',step4Desc:'Detection uses RF scanning for cellular emissions, physical inspection, and GPS jamming detection.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي hardware implants! 🔬 يمكنك التجربة مع covert hardware devices في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج covert hardware devices حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا physical security and implant design حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Imp Pi Zero Dropbox and Imp Evil Maid Toolkit! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch{}log(s.langChanged,'info')}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click()}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter()})})}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none'})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open')}function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}function openSettings(){openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click')}
let matrixRunning=false,matrixAnim=null;function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=innerWidth;canvas.height=innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);const chars='بسمالرحنيوكلتعدفقثصضطظغشزخجذ01';(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)})()}

/* ═══════ APP-SPECIFIC: GPS TRACKER BUILDER ═══════ */
let tracking=false;let gpsParticles=[];let waveTime=0;let trackPoints=[];let trackerPos={x:0.5,y:0.5};

function randomCoord(){return{lat:(33.5+Math.random()*2).toFixed(6),lon:(-7.5+Math.random()*2).toFixed(6),speed:(Math.random()*120).toFixed(0),alt:(50+Math.random()*500).toFixed(0),sats:Math.floor(Math.random()*8)+4,hdop:(0.5+Math.random()*3).toFixed(1)}}

function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;

  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    waveTime+=0.02;

    // Map grid (styled like a dark satellite map)
    ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<canvas.height;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}
    // Simulated roads
    ctx.strokeStyle='rgba(100,100,100,0.3)';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(0,canvas.height*0.4);ctx.lineTo(canvas.width,canvas.height*0.4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(canvas.width*0.3,0);ctx.lineTo(canvas.width*0.3,canvas.height);ctx.stroke();
    ctx.beginPath();ctx.moveTo(canvas.width*0.7,0);ctx.lineTo(canvas.width*0.7,canvas.height);ctx.stroke();

    // GPS satellites (top)
    for(let i=0;i<4;i++){
      const sx=60+i*110,sy=20+Math.sin(waveTime+i*1.5)*5;
      ctx.fillStyle='#334';ctx.beginPath();ctx.arc(sx,sy,4,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=tracking?'rgba(51,255,51,0.15)':'rgba(255,255,255,0.05)';ctx.lineWidth=0.5;
      if(tracking){ctx.beginPath();ctx.moveTo(sx,sy+4);ctx.lineTo(trackerPos.x*canvas.width,trackerPos.y*canvas.height);ctx.stroke()}
    }
    if(tracking)ctx.fillStyle=accent,ctx.font='7px Orbitron',ctx.fillText('GPS LOCK',10,15);

    // Track trail
    if(trackPoints.length>1){
      ctx.strokeStyle='rgba(255,51,51,0.5)';ctx.lineWidth=2;ctx.beginPath();
      trackPoints.forEach((p,i)=>{const px=p.x*canvas.width,py=p.y*canvas.height;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)});
      ctx.stroke();
      // Trail dots
      trackPoints.forEach(p=>{ctx.fillStyle='#ff3333';ctx.beginPath();ctx.arc(p.x*canvas.width,p.y*canvas.height,2,0,Math.PI*2);ctx.fill()});
    }

    // Tracker device
    const tx=trackerPos.x*canvas.width,ty=trackerPos.y*canvas.height;
    if(tracking){
      // Pulse ring
      const pr=((waveTime*30)%40);
      ctx.strokeStyle=`rgba(255,51,51,${0.5-pr/80})`;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(tx,ty,5+pr,0,Math.PI*2);ctx.stroke();
    }
    ctx.fillStyle=tracking?'#ff3333':'#555';ctx.beginPath();ctx.arc(tx,ty,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(tx,ty,2,0,Math.PI*2);ctx.fill();

    // Cellular uplink indicator
    if(tracking){
      ctx.strokeStyle='#ff6600';ctx.lineWidth=1;ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(tx,ty-6);ctx.lineTo(tx+40,15);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='#ff6600';ctx.font='6px Orbitron';ctx.fillText('4G',tx+42,18);
    }

    // Particles
    for(let i=gpsParticles.length-1;i>=0;i--){const p=gpsParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.015;if(p.life<=0){gpsParticles.splice(i,1);continue}ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size||2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}

    // Status bar
    const interval=parseInt(($('intervalSlider')||{}).value||'30');
    ctx.fillStyle=tracking?'rgba(255,51,51,0.15)':'rgba(51,255,51,0.1)';ctx.fillRect(50,canvas.height-20,canvas.width-100,8);
    ctx.fillStyle=tracking?'#ff3333':'#33ff33';ctx.font='8px Orbitron';
    ctx.fillText(`POINTS: ${trackPoints.length} | INT: ${interval}s | ${tracking?'TRACKING':'IDLE'}`,50,canvas.height-6);

    requestAnimationFrame(draw);
  }draw();
}

function spawnGPSParticles(count,color){const canvas=$('simCanvas');if(!canvas)return;const tx=trackerPos.x*canvas.width,ty=trackerPos.y*canvas.height;for(let i=0;i<count;i++){gpsParticles.push({x:tx+(Math.random()-0.5)*20,y:ty+(Math.random()-0.5)*20,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:0.4+Math.random()*0.4,color:color||'#ff3333',size:2+Math.random()*2})}}

function initGPSSim(){
  const trackBtn=$('trackBtn'),reportBtn=$('reportBtn'),detectBtn=$('detectBtn');
  const intervalSlider=$('intervalSlider'),intervalValue=$('intervalValue');
  const outputDisplay=$('outputDisplay'),dataLog=$('dataLog');
  const implantDot=$('implantDot'),implantStatusText=$('implantStatusText');

  if(intervalSlider&&intervalValue)intervalSlider.addEventListener('input',()=>{intervalValue.textContent=intervalSlider.value+'s'});

  let trackIv=null;
  if(trackBtn)trackBtn.addEventListener('click',()=>{
    tracking=!tracking;
    trackBtn.textContent=tracking?'Stop Tracking':(LANG[currentLang].trackBtn||'Start Tracking');
    if(implantDot)implantDot.classList.toggle('active',tracking);
    if(implantStatusText)implantStatusText.textContent=tracking?'Tracker: ACTIVE':'Tracker: Idle';
    setStatus(tracking);
    if(tracking){
      log('📍 GPS tracker activated — acquiring satellite fix...','success');showToast('Acquiring GPS fix...',1500);
      spawnGPSParticles(15,'#33ff33');
      trackIv=setInterval(()=>{
        if(!tracking){clearInterval(trackIv);return}
        // Move tracker
        trackerPos.x+=((Math.random()-0.5)*0.05);trackerPos.y+=((Math.random()-0.5)*0.03);
        trackerPos.x=Math.max(0.1,Math.min(0.9,trackerPos.x));trackerPos.y=Math.max(0.15,Math.min(0.85,trackerPos.y));
        trackPoints.push({...trackerPos});if(trackPoints.length>50)trackPoints.shift();
        const coord=randomCoord();
        spawnGPSParticles(5,'#ff3333');
        if(dataLog)dataLog.textContent=trackPoints.slice(-5).map((_,i)=>{const c=randomCoord();return`[${new Date().toLocaleTimeString()}] ${c.lat},${c.lon} ${c.speed}km/h ${c.sats}sat`}).join('\n');
        log(`📍 Fix: ${coord.lat},${coord.lon} — ${coord.speed}km/h, ${coord.sats} sats`,'rx');
      },2500);
    }else{
      if(trackIv)clearInterval(trackIv);log('⬛ GPS tracker deactivated','info');
    }
  });

  if(reportBtn)reportBtn.addEventListener('click',()=>{
    if(trackPoints.length===0){log('No tracking data — start tracking first','error');return}
    showToast('Generating location report...',2000);log('📡 Compiling tracking report...','info');
    spawnGPSParticles(20,'#4488ff');
    setTimeout(()=>{
      const c=randomCoord();
      if(outputDisplay)outputDisplay.textContent=['TRACKING REPORT','══════════════════',`Last position: ${c.lat}, ${c.lon}`,`Speed: ${c.speed} km/h`,`Altitude: ${c.alt}m`,`Satellites: ${c.sats} (HDOP: ${c.hdop})`,`Track points: ${trackPoints.length}`,``,`Battery: ${(20+Math.floor(Math.random()*80))}%`,`Cell tower: LAC ${Math.floor(Math.random()*9000+1000)}`,`Uplink: 4G (${-(50+Math.floor(Math.random()*40))} dBm)`,`Next report in: ${($('intervalSlider')||{}).value||30}s`].join('\n');
      log('📡 Location report generated','success');hideToast();
    },1500);
  });

  if(detectBtn)detectBtn.addEventListener('click',()=>{
    showToast('Scanning for GPS trackers...',2500);log('🛡️ GPS tracker detection sweep...','info');
    spawnGPSParticles(25,'#33ff33');
    setTimeout(()=>{
      const found=tracking;
      if(outputDisplay)outputDisplay.textContent=(found?['⚠️ GPS TRACKER DETECTED','══════════════════','RF emission: GSM 900/1800 MHz','Interval: Periodic burst every '+(($('intervalSlider')||{}).value||30)+'s','Signal: -'+(30+Math.floor(Math.random()*30))+' dBm','Location: Under vehicle (magnetic mount)','','COUNTERMEASURES:','• Physical removal of device','• GPS jammer (illegal in most jurisdictions)','• RF shielded container','• Professional TSCM sweep']:['✅ NO TRACKERS DETECTED','══════════════════','RF scan: No GSM/4G bursts','GPS jamming: Not detected','Physical: No magnetic devices found','','Vehicle appears clean.']).join('\n');
      log(found?'🚨 GPS tracker found!':'✅ No trackers detected',found?'error':'success');hideToast();
    },2000);
  });

  const sweepBtn=$('sweepBtn');
  if(sweepBtn)sweepBtn.addEventListener('click',()=>{spawnGPSParticles(30,'#d4a03c');log('📡 GNSS constellation scan...','info');showToast('Scanning GNSS constellations...',3000);let step=0;const systems=['GPS (L1/L2)','GLONASS','Galileo','BeiDou','SBAS (WAAS/EGNOS)'];const iv=setInterval(()=>{if(step<systems.length){if(dataLog)dataLog.textContent+=`\n[SCAN] ${systems[step]} — ${Math.floor(Math.random()*12)+2} sats visible`;step++}else{clearInterval(iv);log('📡 GNSS scan complete','success')}},500)});
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
  initHijriDate();initSimCanvas();initGPSSim();
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
