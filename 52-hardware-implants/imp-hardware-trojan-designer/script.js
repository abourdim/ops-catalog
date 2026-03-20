/**
 * imp-hardware-trojan-designer — Workshop DIY
 * IC-level hardware trojan design and detection simulation
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="25" width="50" height="50" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="32" y="32" width="36" height="36" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="50" cy="50" r="8" fill="currentColor" opacity=".3"/><line x1="25" y1="35" x2="15" y2="35" stroke="currentColor" stroke-width="2"/><line x1="25" y1="50" x2="15" y2="50" stroke="currentColor" stroke-width="2"/><line x1="25" y1="65" x2="15" y2="65" stroke="currentColor" stroke-width="2"/><line x1="75" y1="35" x2="85" y2="35" stroke="currentColor" stroke-width="2"/><line x1="75" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="2"/><line x1="75" y1="65" x2="85" y2="65" stroke="currentColor" stroke-width="2"/><line x1="35" y1="25" x2="35" y2="15" stroke="currentColor" stroke-width="2"/><line x1="50" y1="25" x2="50" y2="15" stroke="currentColor" stroke-width="2"/><line x1="65" y1="25" x2="65" y2="15" stroke="currentColor" stroke-width="2"/><line x1="35" y1="75" x2="35" y2="85" stroke="currentColor" stroke-width="2"/><line x1="50" y1="75" x2="50" y2="85" stroke="currentColor" stroke-width="2"/><line x1="65" y1="75" x2="65" y2="85" stroke="currentColor" stroke-width="2"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];const APP_VERSION = '1.0';
let soundEnabled = false;const AudioCtx = window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

const LANG = {
  en: {
    title:'imp-hardware-trojan-designer', subtitle:'🔬 design · 🧬 implant · 🛡️ detect',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Hardware Trojan Designer — IC Backdoor Lab',
    mainDesc:'Design and detect hardware trojans at the integrated circuit level',
    sectionA:'How It Works', sectionB:'Lab — IC Gate Visualizer', sectionC:'Challenge',
    insertBtn:'Insert Trojan', analyzeBtn:'Analyze IC', detectBtn:'Run Detection',
    howStep1:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',
    howStep2:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',
    howStep3:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',
    howStep4:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',
    ready:'🔬 Hardware Trojan Designer ready — select trojan type!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',
    langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip',step1Title:'Design Implant',step1Desc:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',step2Title:'Build & Program',step2Desc:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',step3Title:'Deploy',step3Desc:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',step4Title:'Monitor & Extract',step4Desc:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates hardware implants! 🔬 You get to experiment with covert hardware devices in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real covert hardware devices so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real physical security and implant design! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Imp Supply Chain Backdoor and Imp Gps Tracker Builder! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr: {
    title:'imp-hardware-trojan-designer', subtitle:'🔬 concevoir · 🧬 implanter · 🛡️ détecter',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Concepteur de trojan matériel',mainDesc:'Concevoir et détecter les trojans matériels au niveau IC',
    sectionA:'Comment ça marche',sectionB:'Labo — Portes logiques',sectionC:'Défi',
    insertBtn:'Insérer',analyzeBtn:'Analyser',detectBtn:'Détecter',
    ready:'🔬 Concepteur de trojan prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer',step1Title:'Concevoir l\'implant',step1Desc:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',step2Title:'Construire et programmer',step2Desc:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',step3Title:'Déployer',step3Desc:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',step4Title:'Surveiller et extraire',step4Desc:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule hardware implants ! 🔬 Tu peux expérimenter avec covert hardware devices en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais covert hardware devices.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai physical security and implant design ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Imp Supply Chain Backdoor and Imp Gps Tracker Builder ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar: {
    title:'imp-hardware-trojan-designer', subtitle:'🔬 تصميم · 🧬 زرع · 🛡️ كشف',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'مصمم أحصنة طروادة — مختبر الدوائر المتكاملة',
    mainDesc:'تصميم وكشف أحصنة طروادة على مستوى الدوائر المتكاملة',
    sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
    insertBtn:'إدراج',analyzeBtn:'تحليل',detectBtn:'كشف',
    ready:'🔬 مصمم أحصنة طروادة جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',
    langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي',step1Title:'تصميم الزرع',step1Desc:'Hardware trojans are malicious modifications to integrated circuits during design or fabrication.',step2Title:'بناء وبرمجة',step2Desc:'They can leak cryptographic keys, create backdoors, or cause denial of service via kill switches.',step3Title:'نشر',step3Desc:'Trojans hide in rarely-activated circuit paths, triggered by specific input sequences or timers.',step4Title:'مراقبة واستخراج',step4Desc:'Detection uses side-channel analysis (power, EM), golden chip comparison, and formal verification.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي hardware implants! 🔬 يمكنك التجربة مع covert hardware devices في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج covert hardware devices حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا physical security and implant design حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Imp Supply Chain Backdoor and Imp Gps Tracker Builder! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
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

/* ═══════ APP-SPECIFIC: HARDWARE TROJAN DESIGNER ═══════ */
let trojanInserted = false;
let gateParticles = [];
let waveTime = 0;
let trojanGates = [];

// IC gate definitions
const gates = [
  {id:'and1',type:'AND',x:0.25,y:0.25,inputs:2,trojan:false},
  {id:'or1',type:'OR',x:0.25,y:0.55,inputs:2,trojan:false},
  {id:'nand1',type:'NAND',x:0.5,y:0.2,inputs:2,trojan:false},
  {id:'xor1',type:'XOR',x:0.5,y:0.5,inputs:2,trojan:false},
  {id:'nor1',type:'NOR',x:0.5,y:0.8,inputs:2,trojan:false},
  {id:'buf1',type:'BUF',x:0.75,y:0.35,inputs:1,trojan:false},
  {id:'inv1',type:'INV',x:0.75,y:0.65,inputs:1,trojan:false},
];
const wires = [['and1','nand1'],['or1','xor1'],['nand1','buf1'],['xor1','inv1'],['nor1','inv1']];

function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;

  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    waveTime+=0.02;

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=15){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<canvas.height;y+=15){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}

    // IC Package outline
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.setLineDash([]);
    ctx.strokeRect(40,20,canvas.width-80,canvas.height-40);
    ctx.fillStyle=accent;ctx.font='7px Orbitron';ctx.fillText('IC DIE',canvas.width/2-12,35);

    // Pins
    for(let i=0;i<6;i++){
      ctx.fillStyle='#555';ctx.fillRect(10,35+i*35,30,8); // left pins
      ctx.fillRect(canvas.width-40,35+i*35,30,8); // right pins
    }
    for(let i=0;i<4;i++){
      ctx.fillRect(80+i*80,canvas.height-18,8,18); // bottom pins
      ctx.fillRect(80+i*80,0,8,18); // top pins
    }

    // Wires between gates
    wires.forEach(([a,b])=>{
      const ga=gates.find(g=>g.id===a),gb=gates.find(g=>g.id===b);
      if(!ga||!gb)return;
      const ax=ga.x*canvas.width,ay=ga.y*(canvas.height-60)+30;
      const bx=gb.x*canvas.width,by=gb.y*(canvas.height-60)+30;
      ctx.strokeStyle=(ga.trojan||gb.trojan)?'#ff3333':'#335533';
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ax+15,ay);ctx.lineTo(bx-15,by);ctx.stroke();
    });

    // Gates
    gates.forEach(g=>{
      const gx=g.x*canvas.width,gy=g.y*(canvas.height-60)+30;
      ctx.fillStyle=g.trojan?'#330000':'#112211';
      ctx.strokeStyle=g.trojan?'#ff3333':accent;
      ctx.lineWidth=g.trojan?2:1.5;
      ctx.beginPath();ctx.roundRect(gx-18,gy-12,36,24,3);ctx.fill();ctx.stroke();

      // Gate label
      ctx.fillStyle=g.trojan?'#ff3333':accent;ctx.font='8px Orbitron';ctx.textAlign='center';
      ctx.fillText(g.type,gx,gy+3);ctx.textAlign='left';

      // Trojan blink
      if(g.trojan){
        const b=Math.sin(waveTime*5+g.x*10)>0;
        ctx.fillStyle=b?'#ff0000':'#440000';
        ctx.beginPath();ctx.arc(gx+14,gy-8,2.5,0,Math.PI*2);ctx.fill();
      }
    });

    // Trojan trigger line (if inserted)
    if(trojanInserted){
      const tg=gates.filter(g=>g.trojan);
      if(tg.length>=2){
        ctx.strokeStyle='#ff3333';ctx.lineWidth=1;ctx.setLineDash([3,4]);
        const a=tg[0],b=tg[tg.length-1];
        ctx.beginPath();ctx.moveTo(a.x*canvas.width,a.y*(canvas.height-60)+30);
        ctx.lineTo(b.x*canvas.width,b.y*(canvas.height-60)+30);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle='#ff3333';ctx.font='7px Orbitron';
        ctx.fillText('TROJAN PATH',(a.x+b.x)/2*canvas.width-25,(a.y+b.y)/2*(canvas.height-60)+20);
      }
    }

    // Particles
    for(let i=gateParticles.length-1;i>=0;i--){
      const p=gateParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.015;
      if(p.life<=0){gateParticles.splice(i,1);continue}
      ctx.globalAlpha=p.life;ctx.fillStyle=p.color||'#33ff33';
      ctx.beginPath();ctx.arc(p.x,p.y,p.size||2,0,Math.PI*2);ctx.fill();
      if(p.label){ctx.font='6px Orbitron';ctx.fillText(p.label,p.x+4,p.y-2)}
      ctx.globalAlpha=1;
    }

    // Status bar
    const tCount=gates.filter(g=>g.trojan).length;
    ctx.fillStyle=trojanInserted?'rgba(255,51,51,0.15)':'rgba(51,255,51,0.1)';
    ctx.fillRect(50,canvas.height-25,canvas.width-100,10);
    ctx.fillStyle=trojanInserted?'#ff3333':'#33ff33';ctx.font='9px Orbitron';
    ctx.fillText(`GATES: ${gates.length} | TROJANS: ${tCount} | ${($('trojanTypeSelect')||{}).value||'combinational'}`,50,canvas.height-8);

    requestAnimationFrame(draw);
  }
  draw();
}

function spawnGateParticles(count,color){
  const canvas=$('simCanvas');if(!canvas)return;
  for(let i=0;i<count;i++){
    const g=gates[Math.floor(Math.random()*gates.length)];
    gateParticles.push({x:g.x*canvas.width,y:g.y*(canvas.height-60)+30,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:0.4+Math.random()*0.4,color:color||'#33ff33',size:2+Math.random()*2,label:Math.random()>0.7?['SIG','CLK','RST','VDD','GND'][Math.floor(Math.random()*5)]:null});
  }
}

function initTrojanSim(){
  const insertBtn=$('insertBtn'),analyzeBtn=$('analyzeBtn'),detectBtn=$('detectBtn');
  const outputDisplay=$('outputDisplay'),dataLog=$('dataLog');
  const implantDot=$('implantDot'),implantStatusText=$('implantStatusText');

  if(insertBtn)insertBtn.addEventListener('click',()=>{
    trojanInserted=!trojanInserted;
    insertBtn.textContent=trojanInserted?'Remove Trojan':(LANG[currentLang].insertBtn||'Insert Trojan');
    if(implantDot)implantDot.classList.toggle('active',trojanInserted);
    if(implantStatusText)implantStatusText.textContent=trojanInserted?'Trojan: INSERTED':'Trojan: Clean';
    setStatus(trojanInserted);

    if(trojanInserted){
      const type=($('trojanTypeSelect')||{}).value||'combinational';
      // Mark 2-3 random gates as trojaned
      trojanGates=[];
      const indices=[...Array(gates.length).keys()].sort(()=>Math.random()-0.5).slice(0,2+Math.floor(Math.random()*2));
      gates.forEach((g,i)=>g.trojan=indices.includes(i));
      trojanGates=gates.filter(g=>g.trojan);
      log(`🧬 Hardware trojan inserted — ${trojanGates.length} gates modified (${type})`,'success');
      showToast('Inserting trojan into IC...',1500);
      spawnGateParticles(20,'#ff3333');
      if(dataLog)dataLog.textContent=`Trojan type: ${type}\nAffected gates: ${trojanGates.map(g=>g.id).join(', ')}\nTrigger: ${type==='sequential'?'Counter-based (2^32 cycles)':'Rare input combination'}`;
    }else{
      gates.forEach(g=>g.trojan=false);trojanGates=[];
      log('🧹 Trojan removed — IC restored to clean state','info');
      spawnGateParticles(15,'#33ff33');
    }
  });

  if(analyzeBtn)analyzeBtn.addEventListener('click',()=>{
    showToast('Analyzing IC layout...',2500);log('🔬 Running IC analysis...','info');
    spawnGateParticles(20,'#4488ff');
    setTimeout(()=>{
      const analysis=['IC ANALYSIS REPORT','══════════════════',`Total gates: ${gates.length}`,`Gate types: AND, OR, NAND, XOR, NOR, BUF, INV`,`Die area: ${(2.1+Math.random()*1.5).toFixed(1)}mm²`,`Process: 28nm CMOS`,`Power: ${(0.8+Math.random()*2).toFixed(1)}mW`,`Clock: ${(100+Math.floor(Math.random()*900))}MHz`,'',trojanInserted?`⚠️ ANOMALY: ${trojanGates.length} gates show unusual connectivity`:'✅ No structural anomalies detected',trojanInserted?`Suspicious area: ${(0.01+Math.random()*0.05).toFixed(3)}mm² (${(0.5+Math.random()*2).toFixed(1)}% of die)`:'All gates match reference netlist'].join('\n');
      if(outputDisplay)outputDisplay.textContent=analysis;
      log(trojanInserted?'⚠️ IC analysis found anomalies':'✅ IC analysis clean',trojanInserted?'error':'success');
      hideToast();
    },2000);
  });

  if(detectBtn)detectBtn.addEventListener('click',()=>{
    showToast('Running trojan detection suite...',3000);log('🛡️ Multi-method trojan detection...','info');
    spawnGateParticles(25,'#d4a03c');
    let step=0;
    const methods=['Side-channel power analysis','EM emanation scan','Path delay fingerprinting','Logic testing (ATPG)','Golden chip comparison'];
    const iv=setInterval(()=>{
      if(step<methods.length){log(`🔍 ${methods[step]}...`,'info');spawnGateParticles(5,'#d4a03c');step++}
      else{
        clearInterval(iv);
        const detected=trojanInserted&&Math.random()>0.2;
        const result=detected?['⚠️ TROJAN DETECTED','══════════════════','Method: Side-channel power analysis','Confidence: '+(85+Math.floor(Math.random()*15))+'%','Location: Gates '+trojanGates.map(g=>g.id).join(', '),'Type: '+(($('trojanTypeSelect')||{}).value||'combinational'),'','Power anomaly: +'+((Math.random()*0.5)+0.1).toFixed(2)+'mW','Path delay delta: +'+((Math.random()*50)+10).toFixed(0)+'ps','Recommendation: QUARANTINE IC'].join('\n'):['✅ NO TROJAN DETECTED','══════════════════','Power profile: Normal','EM signature: Clean','Path delays: Within tolerance','Logic test coverage: 98.7%','','IC appears genuine.'].join('\n');
        if(outputDisplay)outputDisplay.textContent=result;
        log(detected?'🚨 Hardware trojan detected!':'✅ Detection suite clean',detected?'error':'success');
        hideToast();
      }
    },500);
  });

  const sweepBtn=$('sweepBtn');
  if(sweepBtn)sweepBtn.addEventListener('click',()=>{
    spawnGateParticles(30,'#d4a03c');log('📡 Full IC characterization sweep...','info');
    showToast('Characterizing IC...',3000);
    let step=0;const phases=['Power profiling','Timing analysis','Leakage measurement','Thermal imaging','X-ray inspection'];
    const iv=setInterval(()=>{if(step<phases.length){if(dataLog)dataLog.textContent+=`\n[SWEEP] ${phases[step]}...`;step++}else{clearInterval(iv);log('📡 IC characterization complete','success')}},500);
  });
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
  initHijriDate();initSimCanvas();initTrojanSim();
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
