/**
 * Zero-Point Energy Meter — Workshop DIY v1.0
 * Quantum vacuum zero-point energy fluctuation visualization
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"><animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="3" fill="currentColor"><animate attributeName="r" values="2;5;2" dur="1s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.2);o.start(n);o.stop(n+.2);}
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
    ...LANG_BASE.en,title:'Zero-Point Energy Meter',subtitle:'⚛️ Zero-Point Energy Meter — Vacuum fluctuation measurement',disconnected:'Offline',connected:'Measuring',mainSection:'Zero-Point Energy Meter',mainDesc:'Measure simulated quantum vacuum zero-point energy fluctuations',sectionA:'Energy Readings',sectionC:'Theory',activityLog:'Activity Log',clear:'Clear',copy:'Copy',export:'Export',settings:'⚙️ Settings',language:'Language',theme:'Theme',help:'❓ Help',ready:'⚛️ ZPE Meter ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',fieldMode:'Field Mode',tempLabel:'Temperature (mK)',sensitivity:'Sensitivity',theoryIntro:'Zero-point energy is the lowest quantum energy state from Heisenberg uncertainty.',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'⚛️ Measuring ZPE',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What is Zero-Point Energy Meter?',faq_a1:'Zero-Point Energy Meter lets you measure simulated quantum vacuum zero-point energy fluctuations. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you configure the physical constants and initial conditions for the experiment. Then you start the simulation and observe the physics phenomenon in action.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real physics experiments principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Casimir Detector. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Zero-Point Energy Meter! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Energy Readings" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how physics experiments works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Energy Readings" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Compteur Énergie Point Zéro',subtitle:'⚛️ Compteur ZPE — Mesure des fluctuations du vide',disconnected:'Hors ligne',connected:'Mesure',mainSection:'Compteur ZPE',mainDesc:'Mesurer les fluctuations d\'énergie du point zéro du vide quantique',sectionA:'Lectures d\'Énergie',sectionC:'Théorie',activityLog:'Journal',clear:'Effacer',copy:'Copier',export:'Exporter',settings:'⚙️ Paramètres',language:'Langue',theme:'Thème',help:'❓ Aide',ready:'⚛️ Compteur ZPE prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',fieldMode:'Mode de Champ',tempLabel:'Température (mK)',sensitivity:'Sensibilité',theoryIntro:'L\'énergie du point zéro est le plus bas état quantique par l\'incertitude de Heisenberg.',splashHint:'appuyer pour passer',langChanged:'🌐 Français',themeChanged:'🎨 Thème →',simStarted:'⚛️ Mesure en cours',simStopped:'⏹ Arrêté',simReset:'↺ Réinitialisé',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Quantum Random Beacon and Phys Holographic Radio ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'مقياس طاقة النقطة الصفرية',subtitle:'⚛️ مقياس طاقة النقطة الصفرية — قياس تقلبات الفراغ',disconnected:'غير متصل',connected:'يقيس',mainSection:'مقياس طاقة النقطة الصفرية',mainDesc:'قياس تقلبات طاقة النقطة الصفرية للفراغ الكمي',sectionA:'قراءات الطاقة',sectionC:'النظرية',activityLog:'سجل النشاط',clear:'مسح',copy:'نسخ',export:'تصدير',settings:'⚙️ الإعدادات',language:'اللغة',theme:'المظهر',help:'❓ مساعدة',ready:'⚛️ مقياس ZPE جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',fieldMode:'وضع المجال',tempLabel:'الحرارة (مللي كلفن)',sensitivity:'الحساسية',theoryIntro:'طاقة النقطة الصفرية هي أدنى حالة طاقة كمية من مبدأ عدم اليقين لهايزنبرغ.',splashHint:'انقر للتخطي',langChanged:'🌐 العربية',themeChanged:'🎨 المظهر ←',simStarted:'⚛️ جارٍ القياس',simStopped:'⏹ توقف',simReset:'↺ إعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Quantum Random Beacon and Phys Holographic Radio! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='zpe-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ ZPE SIMULATION ═══════ */
let running=false,animFrame=null,time=0;
const vacuumParticles=[];for(let i=0;i<300;i++)vacuumParticles.push({x:Math.random()*800,y:Math.random()*350,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:Math.random(),size:Math.random()*3+1,anti:Math.random()>.5});

function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const mode=$('modeSelect').value,temp=+$('tempSlider').value,sens=+$('sensSlider').value/100;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);

  // Vacuum field background
  for(let x=0;x<w;x+=20){for(let y=0;y<h;y+=20){
    const noise=Math.sin(x*0.01+time)*Math.cos(y*0.01+time*1.3)*sens;
    ctx.fillStyle=`rgba(50,50,150,${Math.abs(noise)*0.1})`;ctx.fillRect(x,y,20,20);
  }}

  // Virtual particle pairs
  vacuumParticles.forEach(p=>{
    p.x+=p.vx*(temp/500);p.y+=p.vy*(temp/500);p.life-=0.02;
    if(p.life<0){p.x=Math.random()*w;p.y=Math.random()*h;p.vx=(Math.random()-.5)*4;p.vy=(Math.random()-.5)*4;p.life=1;p.anti=!p.anti;}
    const alpha=p.life*sens*0.7;
    if(mode==='dirac'){
      ctx.fillStyle=p.anti?`rgba(255,100,100,${alpha})`:`rgba(100,100,255,${alpha})`;
    } else if(mode==='higgs'){
      ctx.fillStyle=`rgba(200,180,100,${alpha})`;
    } else if(mode==='casimir'){
      const inCavity=p.x>w*0.3&&p.x<w*0.7;
      ctx.fillStyle=inCavity?`rgba(100,255,200,${alpha*1.5})`:`rgba(100,200,255,${alpha*0.5})`;
    } else {
      ctx.fillStyle=`rgba(150,200,255,${alpha})`;
    }
    ctx.beginPath();ctx.arc(p.x,p.y,p.size*sens,0,Math.PI*2);ctx.fill();
    // Pair connection lines
    if(p.anti&&p.life>0.5){
      ctx.strokeStyle=`rgba(255,255,255,${alpha*0.2})`;ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+p.vx*10,p.y+p.vy*10);ctx.stroke();
    }
  });

  // Casimir plates
  if(mode==='casimir'){
    ctx.strokeStyle=accent;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(w*0.3,h*0.1);ctx.lineTo(w*0.3,h*0.9);ctx.stroke();
    ctx.beginPath();ctx.moveTo(w*0.7,h*0.1);ctx.lineTo(w*0.7,h*0.9);ctx.stroke();
    ctx.fillStyle='rgba(100,255,200,0.05)';ctx.fillRect(w*0.3,h*0.1,w*0.4,h*0.8);
  }

  // Energy trace (oscilloscope style at bottom)
  const traceY=h*0.85,traceH=40;
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let x=0;x<w;x+=2){
    const noise=(Math.random()-.5)*traceH*sens+(Math.sin(x*0.05+time*3)+Math.sin(x*0.03+time*5))*traceH*0.2*sens;
    const y=traceY+noise;
    x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }ctx.stroke();

  // Gauge
  const gaugeX=w-80,gaugeY=60,gaugeR=40;
  ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(gaugeX,gaugeY,gaugeR,Math.PI*0.8,Math.PI*2.2);ctx.stroke();
  const reading=0.5+Math.sin(time*2)*0.3*sens+Math.random()*0.1*sens;
  const angle=Math.PI*0.8+reading*Math.PI*1.4;
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gaugeX,gaugeY);ctx.lineTo(gaugeX+Math.cos(angle)*gaugeR*0.8,gaugeY+Math.sin(angle)*gaugeR*0.8);ctx.stroke();

  // Metrics
  const zpeDensity=(reading*1e-12*(temp/100)).toExponential(2);
  const fluct=(reading*0.05*sens).toFixed(4);
  const casimirP=(1.3e-27/(Math.pow(0.001,4))*reading*sens).toExponential(2);
  $('zpeVal').textContent=zpeDensity+' J/m³';$('fluctVal').textContent=fluct+' eV';
  $('casimirVal').textContent=casimirP+' Pa';$('fieldTempVal').textContent=temp+' mK';

  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('ZPE METER — '+mode.toUpperCase()+' @ '+temp+' mK',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('tempSlider').value=100;$('tempVal').textContent='100 mK';$('sensSlider').value=50;$('sensVal').textContent='50%';$('modeSelect').value='em';
  $('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('zpeVal').textContent='-- J/m³';$('fluctVal').textContent='-- eV';$('casimirVal').textContent='-- Pa';$('fieldTempVal').textContent='-- mK';log(LANG[currentLang].simReset,'info');}
function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  $('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;
  $('tempSlider').oninput=function(){$('tempVal').textContent=this.value+' mK';};
  $('sensSlider').oninput=function(){$('sensVal').textContent=this.value+'%';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Zero-Point Energy Meter
   Animated quantum vacuum fluctuations with virtual particle pairs,
   Casimir effect plates, and energy density visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simZeroPoint';let cv,cx,W,H,af=null,t=0;
  const virtualPairs=[];const fluctHistory=[];const MAX_PAIRS=80;
  let zpeLevel=0,temperature=4;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  class VirtualPair{
    constructor(){
      this.x=Math.random()*W;this.y=Math.random()*H;
      this.life=20+Math.random()*40;this.age=0;
      this.sep=0;this.maxSep=8+Math.random()*15;
      this.angle=Math.random()*Math.PI*2;
      this.energy=0.3+Math.random()*0.7;
      this.hue=Math.random()>0.5?200:340;
    }
    update(){
      this.age++;
      const phase=this.age/this.life;
      this.sep=Math.sin(phase*Math.PI)*this.maxSep;
      return this.age<this.life;
    }
    draw(){
      const alpha=Math.sin(this.age/this.life*Math.PI)*0.7;
      const dx=Math.cos(this.angle)*this.sep;
      const dy=Math.sin(this.angle)*this.sep;
      const r=2+this.energy*2;
      // Particle
      cx.save();cx.globalAlpha=alpha;
      cx.fillStyle='hsla('+this.hue+',80%,60%,0.8)';
      cx.beginPath();cx.arc(this.x+dx,this.y+dy,r,0,Math.PI*2);cx.fill();
      // Anti-particle
      cx.fillStyle='hsla('+((this.hue+180)%360)+',80%,60%,0.8)';
      cx.beginPath();cx.arc(this.x-dx,this.y-dy,r,0,Math.PI*2);cx.fill();
      // Connection line
      cx.strokeStyle='rgba(255,255,255,'+(alpha*0.2)+')';cx.lineWidth=0.5;
      cx.beginPath();cx.moveTo(this.x+dx,this.y+dy);cx.lineTo(this.x-dx,this.y-dy);cx.stroke();
      // Annihilation flash
      if(this.age>this.life*0.85){
        const flash=((this.age-this.life*0.85)/(this.life*0.15))*10;
        cx.fillStyle='rgba(255,255,200,'+(alpha*0.3)+')';
        cx.beginPath();cx.arc(this.x,this.y,flash,0,Math.PI*2);cx.fill();
      }
      cx.restore();
    }
  }

  function drawVacuumField(){
    // Background quantum foam
    for(let i=0;i<30;i++){
      const x=Math.random()*W,y=Math.random()*H;
      const r=Math.random()*1.5;
      cx.fillStyle='rgba(100,150,255,'+(Math.random()*0.06)+')';
      cx.beginPath();cx.arc(x,y,r,0,Math.PI*2);cx.fill();
    }
  }

  function drawEnergyMeter(){
    const mx=W-200,my=20,mw=180,mh=100;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(mx,my,mw,mh);
    cx.strokeStyle='rgba(100,200,255,0.15)';cx.strokeRect(mx,my,mw,mh);
    // Energy level bar
    const barH=mh-30;const barW=20;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(mx+mw-35,my+10,barW,barH);
    const level=zpeLevel*barH;
    const grad=cx.createLinearGradient(0,my+10+barH,0,my+10);
    grad.addColorStop(0,'#3b82f6');grad.addColorStop(0.5,'#8b5cf6');grad.addColorStop(1,'#ef4444');
    cx.fillStyle=grad;cx.fillRect(mx+mw-35,my+10+barH-level,barW,level);
    // Labels
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('ZPE METER',mx+8,my+14);
    cx.fillText('E = (1/2)hf',mx+8,my+28);
    cx.fillText('Fluctuation:',mx+8,my+44);
    cx.fillText((zpeLevel*100).toFixed(1)+' %',mx+8,my+56);
    cx.fillText('Virtual Pairs:',mx+8,my+70);
    cx.fillText(virtualPairs.length.toString(),mx+8,my+82);
    cx.fillText('Temp: '+temperature+' mK',mx+8,my+94);
  }

  function drawFluctuationGraph(){
    const gx=20,gy=H-80,gw=W-250,gh=60;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(gx,gy,gw,gh);
    cx.strokeStyle='rgba(100,200,255,0.1)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(gx,gy+gh/2);cx.lineTo(gx+gw,gy+gh/2);cx.stroke();
    if(fluctHistory.length>1){
      cx.strokeStyle='rgba(139,92,246,0.6)';cx.lineWidth=1.5;cx.beginPath();
      const step=gw/Math.max(1,fluctHistory.length-1);
      fluctHistory.forEach((v,i)=>{
        const x=gx+i*step;const y=gy+gh/2-v*gh*0.4;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.fillStyle='rgba(139,92,246,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('VACUUM ENERGY FLUCTUATION TRACE',gx+8,gy-4);
  }

  function drawCasimirPlates(){
    const px=W/2-60,py=30,pw=120,ph=H-130;
    // Left plate
    cx.fillStyle='rgba(100,100,120,0.3)';cx.fillRect(px,py,4,ph);
    cx.strokeStyle='rgba(200,200,220,0.3)';cx.strokeRect(px,py,4,ph);
    // Right plate
    const sep=40+Math.sin(t*0.5)*10;
    cx.fillStyle='rgba(100,100,120,0.3)';cx.fillRect(px+sep,py,4,ph);
    cx.strokeStyle='rgba(200,200,220,0.3)';cx.strokeRect(px+sep,py,4,ph);
    // Arrows showing Casimir force
    cx.strokeStyle='rgba(255,200,100,0.3)';cx.lineWidth=1;
    const acy=py+ph/2;
    cx.beginPath();cx.moveTo(px-15,acy);cx.lineTo(px,acy);cx.stroke();
    cx.beginPath();cx.moveTo(px+sep+4,acy);cx.lineTo(px+sep+19,acy);cx.stroke();
    cx.fillStyle='rgba(255,200,100,0.3)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('Casimir Force',px+sep/2+2,py-5);
    cx.fillText('<-- F -->',px+sep/2+2,acy-8);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,210,54);
    cx.strokeStyle='rgba(139,92,246,0.2)';cx.strokeRect(8,8,210,54);
    cx.font='10px monospace';cx.fillStyle='#8b5cf6';cx.textAlign='left';
    cx.fillText('ZERO-POINT ENERGY METER',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Quantum Vacuum Fluctuation Viz',16,40);
    cx.fillText('h-bar omega/2 per mode',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.1)';cx.fillRect(0,0,W,H);

    drawVacuumField();
    drawCasimirPlates();

    // Spawn virtual pairs
    if(Math.random()<0.15&&virtualPairs.length<MAX_PAIRS){
      virtualPairs.push(new VirtualPair());
    }
    for(let i=virtualPairs.length-1;i>=0;i--){
      if(!virtualPairs[i].update())virtualPairs.splice(i,1);
      else virtualPairs[i].draw();
    }

    // Update ZPE level
    zpeLevel=0.3+0.2*Math.sin(t*1.5)+0.15*Math.sin(t*3.7)+0.1*Math.random();
    fluctHistory.push(Math.sin(t*2)*0.5+Math.sin(t*5)*0.3+(Math.random()-0.5)*0.4);
    if(fluctHistory.length>300)fluctHistory.shift();

    drawEnergyMeter();drawFluctuationGraph();drawHUD();

    cx.fillStyle='rgba(139,92,246,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Quantum Vacuum Zero-Point Energy — Virtual Particle Pair Annihilation',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
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
