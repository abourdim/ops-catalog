/**
 * imp-covert-audio-implant — Workshop DIY
 * Covert audio bug / listening device simulation for TSCM training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="40" rx="12" ry="20" fill="none" stroke="currentColor" stroke-width="2"/><line x1="50" y1="60" x2="50" y2="75" stroke="currentColor" stroke-width="2"/><line x1="38" y1="75" x2="62" y2="75" stroke="currentColor" stroke-width="2"/><path d="M30 40 Q30 70 50 70 Q70 70 70 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="50" cy="40" r="5" fill="currentColor" opacity=".4"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

const LANG={
  en:{title:'imp-covert-audio-implant',subtitle:'🎙️ listen · 📡 transmit · 🛡️ sweep',disconnected:'Disconnected',connected:'Connected',mainSection:'Covert Audio Implant — TSCM Training Lab',mainDesc:'Simulate hidden microphone implants and learn technical surveillance countermeasures',sectionA:'How It Works',sectionB:'Lab — Audio Waveform Analyzer',sectionC:'Challenge',listenBtn:'Activate Bug',analyzeBtn:'Analyze Audio',sweepBtn:'TSCM Sweep',howStep1:'Covert audio bugs use MEMS microphones smaller than a grain of rice, hidden in everyday objects.',howStep2:'Wireless bugs transmit audio via FM, GSM, WiFi, or burst transmission to avoid continuous RF emission.',howStep3:'Advanced bugs use spread-spectrum or frequency-hopping to evade standard RF sweep detection.',howStep4:'TSCM (Technical Surveillance Countermeasures) uses NLJD, spectrum analyzers, and thermal cameras.',ready:'🎙️ Covert Audio Implant ready — select bug type!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip',step1Title:'Design Implant',step1Desc:'Covert audio bugs use MEMS microphones smaller than a grain of rice, hidden in everyday objects.',step2Title:'Build & Program',step2Desc:'Wireless bugs transmit audio via FM, GSM, WiFi, or burst transmission to avoid continuous RF emission.',step3Title:'Deploy',step3Desc:'Advanced bugs use spread-spectrum or frequency-hopping to evade standard RF sweep detection.',step4Title:'Monitor & Extract',step4Desc:'TSCM (Technical Surveillance Countermeasures) uses NLJD, spectrum analyzers, and thermal cameras.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates hardware implants! 🔬 You get to experiment with covert hardware devices in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real covert hardware devices so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real physical security and implant design! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Imp Magnetic Stripe Cloner and Imp Usb Implant Designer! Each teaches something different. 🚀'},
  fr:{title:'imp-covert-audio-implant',subtitle:'🎙️ écouter · 📡 transmettre · 🛡️ balayer',disconnected:'Déconnecté',connected:'Connecté',mainSection:'Micro espion — Labo TSCM',mainDesc:'Simulez des implants audio cachés et les contre-mesures de surveillance',sectionA:'Comment ça marche',sectionB:'Labo — Analyseur audio',sectionC:'Défi',listenBtn:'Activer',analyzeBtn:'Analyser',sweepBtn:'Balayage',ready:'🎙️ Micro espion prêt !',logCleared:'Journal effacé',copied:'Copié !',working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer',step1Title:'Concevoir l\'implant',step1Desc:'Covert audio bugs use MEMS microphones smaller than a grain of rice, hidden in everyday objects.',step2Title:'Construire et programmer',step2Desc:'Wireless bugs transmit audio via FM, GSM, WiFi, or burst transmission to avoid continuous RF emission.',step3Title:'Déployer',step3Desc:'Advanced bugs use spread-spectrum or frequency-hopping to evade standard RF sweep detection.',step4Title:'Surveiller et extraire',step4Desc:'TSCM (Technical Surveillance Countermeasures) uses NLJD, spectrum analyzers, and thermal cameras.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule hardware implants ! 🔬 Tu peux expérimenter avec covert hardware devices en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais covert hardware devices.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai physical security and implant design ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Imp Magnetic Stripe Cloner and Imp Usb Implant Designer ! Chacune enseigne quelque chose de différent. 🚀'},
  ar:{title:'imp-covert-audio-implant',subtitle:'🎙️ استماع · 📡 إرسال · 🛡️ مسح',disconnected:'غير متصل',connected:'متصل',mainSection:'جهاز تنصت مخفي — مختبر مكافحة المراقبة',mainDesc:'محاكاة أجهزة التنصت المخفية وتعلم إجراءات المكافحة',sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',listenBtn:'تفعيل',analyzeBtn:'تحليل',sweepBtn:'مسح',ready:'🎙️ جهاز التنصت جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي',step1Title:'تصميم الزرع',step1Desc:'Covert audio bugs use MEMS microphones smaller than a grain of rice, hidden in everyday objects.',step2Title:'بناء وبرمجة',step2Desc:'Wireless bugs transmit audio via FM, GSM, WiFi, or burst transmission to avoid continuous RF emission.',step3Title:'نشر',step3Desc:'Advanced bugs use spread-spectrum or frequency-hopping to evade standard RF sweep detection.',step4Title:'مراقبة واستخراج',step4Desc:'TSCM (Technical Surveillance Countermeasures) uses NLJD, spectrum analyzers, and thermal cameras.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي hardware implants! 🔬 يمكنك التجربة مع covert hardware devices في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج covert hardware devices حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا physical security and implant design حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Imp Magnetic Stripe Cloner and Imp Usb Implant Designer! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
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

/* ═══════ APP-SPECIFIC: COVERT AUDIO IMPLANT ═══════ */
let bugActive=false;let audioParticles=[];let waveTime=0;let audioSamples=[];

function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;
  // Generate initial waveform buffer
  for(let i=0;i<200;i++)audioSamples.push(0);

  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    waveTime+=0.03;

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<canvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}

    // Microphone icon (left)
    const micX=60,micY=canvas.height/2-20;
    ctx.strokeStyle=bugActive?'#ff3333':accent;ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(micX,micY,10,18,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=bugActive?'#ff3333':'#333';ctx.beginPath();ctx.ellipse(micX,micY,10,18,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=bugActive?'#ff6666':accent;ctx.beginPath();ctx.arc(micX,micY,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=accent;ctx.font='7px Orbitron';ctx.fillText('BUG',micX-8,micY+30);

    // Sound waves entering mic (when active)
    if(bugActive){
      for(let w=0;w<3;w++){
        const phase=(waveTime*3+w*1.2)%4;const r=phase/4*25;const alpha=1-phase/4;
        ctx.strokeStyle=`rgba(255,51,51,${alpha*0.4})`;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(micX-15,micY,8+r,1.2,5.1);ctx.stroke();
      }
    }

    // Audio waveform display (center)
    if(bugActive){
      // Update waveform
      audioSamples.shift();
      audioSamples.push(Math.sin(waveTime*5)*20+Math.sin(waveTime*13)*10+Math.sin(waveTime*31)*5+(Math.random()-0.5)*15);
    }

    const wfY=canvas.height/2-20;
    ctx.strokeStyle=bugActive?'#33ff33':'#333';ctx.lineWidth=1.5;
    ctx.beginPath();
    const wfStartX=110,wfEndX=canvas.width-100;
    const wfW=wfEndX-wfStartX;
    for(let i=0;i<audioSamples.length;i++){
      const x=wfStartX+i/audioSamples.length*wfW;
      const y=wfY+audioSamples[i];
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();
    // Center line
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(wfStartX,wfY);ctx.lineTo(wfEndX,wfY);ctx.stroke();

    // Transmitter (right)
    const txX=canvas.width-60,txY=canvas.height/2-20;
    ctx.fillStyle='#111';ctx.strokeStyle=bugActive?'#ff6600':accent;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.roundRect(txX-18,txY-15,36,30,3);ctx.fill();ctx.stroke();
    ctx.fillStyle=bugActive?'#ff6600':accent;ctx.font='7px Orbitron';ctx.fillText('TX',txX-5,txY+3);

    // TX antenna waves
    if(bugActive){
      for(let w=0;w<3;w++){
        const phase=(waveTime*3+w*1.2)%4;const r=phase/4*30;const alpha=1-phase/4;
        ctx.strokeStyle=`rgba(255,102,0,${alpha*0.4})`;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(txX+18,txY,8+r,-0.8,0.8);ctx.stroke();
      }
    }

    // Data flow mic -> waveform -> TX
    if(bugActive){
      ctx.strokeStyle='rgba(255,51,51,0.2)';ctx.lineWidth=1;ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(micX+10,micY);ctx.lineTo(wfStartX,wfY);ctx.stroke();
      ctx.beginPath();ctx.moveTo(wfEndX,wfY);ctx.lineTo(txX-18,txY);ctx.stroke();
      ctx.setLineDash([]);
    }

    // Spectrum analyzer (bottom)
    const specY=canvas.height-70;
    ctx.fillStyle='rgba(51,255,51,0.05)';ctx.fillRect(wfStartX,specY,wfW,40);
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.strokeRect(wfStartX,specY,wfW,40);
    // Spectrum bars
    for(let i=0;i<40;i++){
      const h=bugActive?(Math.sin(waveTime*2+i*0.3)*12+Math.random()*8+5):2;
      ctx.fillStyle=bugActive?(h>20?'#ff3333':'#33ff33'):'#222';
      ctx.fillRect(wfStartX+i*(wfW/40)+1,specY+40-h,wfW/40-2,h);
    }
    ctx.fillStyle=accent;ctx.font='7px Orbitron';ctx.fillText('SPECTRUM',wfStartX,specY-3);

    // Particles
    for(let i=audioParticles.length-1;i>=0;i--){
      const p=audioParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.015;
      if(p.life<=0){audioParticles.splice(i,1);continue}
      ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size||2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    }

    // Status bar
    const gain=parseInt(($('gainSlider')||{}).value||'50');
    ctx.fillStyle=bugActive?'rgba(255,51,51,0.15)':'rgba(51,255,51,0.1)';
    ctx.fillRect(50,canvas.height-18,canvas.width-100,8);
    ctx.fillStyle=bugActive?'#ff3333':'#33ff33';ctx.font='8px Orbitron';
    ctx.fillText(`GAIN: ${gain}dB | ${($('bugTypeSelect')||{}).value||'fm'} | ${bugActive?'LIVE':'OFF'}`,50,canvas.height-6);

    requestAnimationFrame(draw);
  }draw();
}

function spawnAudioParticles(count,color){
  const canvas=$('simCanvas');if(!canvas)return;
  for(let i=0;i<count;i++){
    audioParticles.push({x:60+Math.random()*30,y:canvas.height/2-30+Math.random()*20,vx:2+Math.random()*3,vy:(Math.random()-0.5)*2,life:0.4+Math.random()*0.4,color:color||'#ff3333',size:2+Math.random()*2});
  }
}

function initAudioSim(){
  const listenBtn=$('listenBtn'),analyzeBtn=$('analyzeBtn'),sweepBtn=$('sweepBtn');
  const gainSlider=$('gainSlider'),gainValue=$('gainValue');
  const outputDisplay=$('outputDisplay'),dataLog=$('dataLog');
  const implantDot=$('implantDot'),implantStatusText=$('implantStatusText');

  if(gainSlider&&gainValue)gainSlider.addEventListener('input',()=>{gainValue.textContent=gainSlider.value+'dB'});

  let listenIv=null;
  if(listenBtn)listenBtn.addEventListener('click',()=>{
    bugActive=!bugActive;
    listenBtn.textContent=bugActive?'Deactivate':(LANG[currentLang].listenBtn||'Activate Bug');
    if(implantDot)implantDot.classList.toggle('active',bugActive);
    if(implantStatusText)implantStatusText.textContent=bugActive?'Bug: TRANSMITTING':'Bug: Dormant';
    setStatus(bugActive);
    if(bugActive){
      const type=($('bugTypeSelect')||{}).value||'fm';
      log(`🎙️ Audio bug activated — ${type.toUpperCase()} transmission started`,'success');
      showToast('Bug active — capturing audio...',1500);
      spawnAudioParticles(15,'#ff3333');
      listenIv=setInterval(()=>{
        if(!bugActive){clearInterval(listenIv);return}
        const db=(40+Math.random()*40).toFixed(0);
        spawnAudioParticles(3,'#ff3333');
        if(dataLog)dataLog.textContent+=`\n[${new Date().toLocaleTimeString()}] Audio level: ${db}dB — ${db>60?'SPEECH DETECTED':'ambient noise'}`;
        log(`🎙️ Audio capture: ${db}dB`,db>60?'rx':'info');
      },2500);
    }else{
      if(listenIv)clearInterval(listenIv);
      log('⬛ Audio bug deactivated','info');audioSamples.fill(0);
    }
  });

  if(analyzeBtn)analyzeBtn.addEventListener('click',()=>{
    showToast('Analyzing captured audio...',2500);log('🔬 Audio analysis running...','info');
    spawnAudioParticles(20,'#4488ff');
    setTimeout(()=>{
      const hasVoice=bugActive||Math.random()>0.3;
      if(outputDisplay)outputDisplay.textContent=(hasVoice?['AUDIO ANALYSIS','══════════════════','Duration: '+Math.floor(Math.random()*60+10)+' seconds','Speakers detected: '+(1+Math.floor(Math.random()*3)),'Language: English (confidence 87%)','SNR: '+(15+Math.floor(Math.random()*20))+'dB','','Keywords detected:','  "meeting" (3x), "budget" (2x)','  "deadline" (1x), "project" (4x)','','Classification: BUSINESS CONVERSATION']:['NO AUDIO DATA','══════════════════','Activate the bug first to capture audio.']).join('\n');
      log(hasVoice?'🔬 Audio analysis complete — speech detected':'No audio data available',hasVoice?'success':'error');hideToast();
    },2000);
  });

  if(sweepBtn)sweepBtn.addEventListener('click',()=>{
    showToast('TSCM sweep in progress...',3000);log('🛡️ Technical Surveillance Countermeasures sweep...','info');
    spawnAudioParticles(25,'#33ff33');
    let step=0;
    const methods=['RF spectrum scan (1-6 GHz)','Non-linear junction detection','Thermal imaging scan','Acoustic noise generator check','Physical inspection'];
    const iv=setInterval(()=>{
      if(step<methods.length){log(`🔍 ${methods[step]}...`,'info');step++}
      else{
        clearInterval(iv);const found=bugActive;
        if(outputDisplay)outputDisplay.textContent=(found?['⚠️ LISTENING DEVICE DETECTED','══════════════════','Type: '+($('bugTypeSelect')||{}).value+' transmitter','Frequency: '+(400+Math.floor(Math.random()*5000))+' MHz','Signal: -'+(20+Math.floor(Math.random()*40))+' dBm','Location: Wall outlet / power strip area','','COUNTERMEASURES:','• Activate white noise generator','• Remove device physically','• Sweep for secondary bugs','• Check phone lines and power circuits']:['✅ NO BUGS DETECTED','══════════════════','RF: Clean across all bands','NLJD: No semiconductor junctions found','Thermal: No unexpected heat signatures','Physical: No suspicious devices found','','Environment appears clean.']).join('\n');
        log(found?'🚨 Listening device detected!':'✅ TSCM sweep clean',found?'error':'success');hideToast();
      }
    },500);
  });

  const scanBtn=$('scanSpecBtn');
  if(scanBtn)scanBtn.addEventListener('click',()=>{spawnAudioParticles(30,'#d4a03c');log('📡 Full spectrum sweep...','info');showToast('Scanning spectrum...',3000);let step=0;const bands=['VHF (30-300 MHz)','UHF (300-3000 MHz)','SHF (3-30 GHz)','GSM (900/1800 MHz)','WiFi (2.4/5 GHz)'];const iv=setInterval(()=>{if(step<bands.length){if(dataLog)dataLog.textContent+=`\n[SWEEP] ${bands[step]}...`;step++}else{clearInterval(iv);log('📡 Spectrum sweep complete','success')}},500)});
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
  initHijriDate();initSimCanvas();initAudioSim();
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
