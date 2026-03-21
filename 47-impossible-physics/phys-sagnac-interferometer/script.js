/**
 * Sagnac Interferometer — Workshop DIY v1.0
 * Rotation sensing with counter-propagating beams
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="2" opacity=".4"/><circle cx="50" cy="15" r="4" fill="currentColor"><animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="3s" repeatCount="indefinite"/></circle><circle cx="50" cy="15" r="4" fill="currentColor" opacity=".5"><animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" dur="3s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
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

const LANG={en:{
    ...LANG_BASE.en,title:'Sagnac Interferometer',subtitle:'🔄 Sagnac Interferometer — Rotation detection',disconnected:'Offline',connected:'Sensing',ready:'🔄 Sagnac Interferometer ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🔄 Sensing rotation',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What is Sagnac Interferometer?',faq_a1:'Sagnac Interferometer lets you 🔄 sagnac interferometer — rotation detection. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you configure the physical constants and initial conditions for the experiment. Then you start the simulation and observe the physics phenomenon in action.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real physics experiments principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Casimir Detector. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Sagnac Interferometer! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how physics experiments works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},fr:{title:'Interféromètre Sagnac',subtitle:'🔄 Interféromètre Sagnac — Détection de rotation',disconnected:'Hors ligne',connected:'Détecte',ready:'🔄 Interféromètre prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🔄 Détection de rotation',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Plasma Antenna and Phys Superluminal Illusion ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},ar:{title:'مقياس تداخل ساناك',subtitle:'🔄 مقياس تداخل ساناك — كشف الدوران',disconnected:'غير متصل',connected:'يستشعر',ready:'🔄 مقياس ساناك جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🔄 استشعار الدوران',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Plasma Antenna and Phys Superluminal Illusion! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='sagnac-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const rot=+$('rotSlider').value,area=+$('areaSlider').value,wl=+$('wlSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);
  const cx=w*0.35,cy=h/2,loopR=100;
  // Fiber loop (rotating)
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot*Math.PI/180*time*0.1);
  ctx.strokeStyle='rgba(100,200,255,0.3)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,loopR,0,Math.PI*2);ctx.stroke();
  // CW beam (clockwise)
  const cwAngle=time*5;ctx.fillStyle='rgba(255,100,100,0.8)';
  for(let i=0;i<8;i++){const a=cwAngle+i*Math.PI/4;const bx=Math.cos(a)*loopR,by=Math.sin(a)*loopR;ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fill();}
  // CCW beam (counter-clockwise)
  const ccwAngle=-time*5+rot*Math.PI/180*0.001;ctx.fillStyle='rgba(100,100,255,0.8)';
  for(let i=0;i<8;i++){const a=ccwAngle-i*Math.PI/4;const bx=Math.cos(a)*loopR,by=Math.sin(a)*loopR;ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fill();}
  // Beam splitter
  ctx.fillStyle=accent;ctx.fillRect(loopR-5,-3,10,6);ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron';ctx.fillText('BS',loopR-6,-8);
  // Mirrors
  [Math.PI/2,Math.PI,Math.PI*1.5].forEach(a=>{const mx=Math.cos(a)*loopR,my=Math.sin(a)*loopR;ctx.fillStyle='rgba(200,200,200,0.5)';ctx.save();ctx.translate(mx,my);ctx.rotate(a);ctx.fillRect(-5,-3,10,6);ctx.restore();});
  ctx.restore();
  // Rotation arrow
  if(rot>0){ctx.strokeStyle='rgba(255,200,100,0.4)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,loopR+20,0,Math.PI*1.5);ctx.stroke();ctx.fillStyle='rgba(255,200,100,0.4)';ctx.font='10px Orbitron';ctx.fillText('Ω = '+rot+' °/s',cx+loopR+25,cy-10);}
  // Interference pattern (right side)
  const Omega=rot*Math.PI/180;const lambda=wl*1e-9;const c_light=3e8;
  const phaseShift=8*Math.PI*area*Omega/(lambda*c_light);
  const fringeShift=phaseShift/(2*Math.PI);
  const patX=w*0.6,patY=h*0.1,patW=w*0.35,patH=h*0.35;
  ctx.strokeStyle='rgba(100,200,255,0.15)';ctx.strokeRect(patX,patY,patW,patH);
  // Fringe pattern
  for(let x=0;x<patW;x++){
    const intensity=0.5+0.5*Math.cos(x*0.15+phaseShift*50+time*rot*0.01);
    const hue=wl<500?240:wl<600?120:wl<700?60:0;
    ctx.fillStyle=`hsla(${hue},80%,${intensity*60}%,${0.5+intensity*0.5})`;
    ctx.fillRect(patX+x,patY,1,patH);
  }
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='9px Orbitron';ctx.fillText('INTERFERENCE PATTERN',patX+5,patY-5);
  // Phase plot
  const plotY=h*0.55,plotH=h*0.35;
  ctx.strokeStyle='rgba(100,200,255,0.1)';ctx.strokeRect(patX,plotY,patW,plotH);
  ctx.strokeStyle='rgba(100,200,255,0.1)';ctx.beginPath();ctx.moveTo(patX,plotY+plotH/2);ctx.lineTo(patX+patW,plotY+plotH/2);ctx.stroke();
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let x=0;x<patW;x++){
    const t2=(x/patW)*20;
    const y=plotY+plotH/2-Math.sin(t2+phaseShift*10)*plotH*0.3;
    x===0?ctx.moveTo(patX+x,y):ctx.lineTo(patX+x,y);
  }ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='9px Orbitron';ctx.fillText('BEAT SIGNAL',patX+5,plotY-5);

  const beatFreq=(4*area*Omega/(lambda*2*Math.PI*(loopR*2*Math.PI)/(c_light))).toFixed(2);
  $('phaseVal').textContent=phaseShift.toExponential(3)+' rad';$('fringeVal').textContent=fringeShift.toExponential(3);
  $('beatVal').textContent=beatFreq+' Hz';$('sensVal').textContent=(phaseShift/(rot+0.001)).toExponential(3)+' rad/(°/s)';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('SAGNAC — Ω='+rot+'°/s Δφ='+phaseShift.toExponential(2)+' rad',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('rotSlider').value=15;$('rotVal').textContent='15 °/s';$('areaSlider').value=10;$('areaVal').textContent='10 m²';$('wlSlider').value=633;$('wlVal').textContent='633 nm';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('phaseVal').textContent='-- rad';$('fringeVal').textContent='-- fringes';$('beatVal').textContent='-- Hz';$('sensVal').textContent='-- rad/(°/s)';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('rotSlider').oninput=function(){$('rotVal').textContent=this.value+' °/s';};$('areaSlider').oninput=function(){$('areaVal').textContent=this.value+' m²';};$('wlSlider').oninput=function(){$('wlVal').textContent=this.value+' nm';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Sagnac Interferometer
   Animated counter-propagating beams in rotating loop with
   fringe pattern, phase shift, and rotation sensing
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simSagnac';let cv,cx,W,H,af=null,t=0;
  let rotRate=15,loopArea=10,wavelength=633,phaseShift=0;
  const cwPhotons=[];const ccwPhotons=[];const fringeHistory=[];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawInterferometerLoop(){
    const lcx=W*0.35,lcy=H/2,lr=100;
    // Rotating ring
    cx.save();cx.translate(lcx,lcy);cx.rotate(t*rotRate*Math.PI/180*0.01);
    cx.strokeStyle='rgba(100,200,255,0.2)';cx.lineWidth=2;
    cx.beginPath();cx.arc(0,0,lr,0,Math.PI*2);cx.stroke();
    // Mirrors at cardinal points
    const mirrors=[0,Math.PI/2,Math.PI,Math.PI*3/2];
    mirrors.forEach(a=>{
      const mx=Math.cos(a)*lr,my=Math.sin(a)*lr;
      cx.save();cx.translate(mx,my);cx.rotate(a+Math.PI/4);
      cx.fillStyle='rgba(200,200,220,0.5)';cx.fillRect(-5,-8,10,3);
      cx.restore();
    });
    cx.restore();
    // Beam splitter
    cx.save();cx.translate(lcx+lr,lcy);cx.rotate(Math.PI/4);
    cx.fillStyle='rgba(100,200,255,0.3)';cx.fillRect(-4,-8,8,16);
    cx.restore();
    // CW beam (clockwise)
    cx.strokeStyle='rgba(255,100,100,0.4)';cx.lineWidth=1.5;
    const cwPhase=t*3;
    cx.beginPath();
    for(let a=0;a<Math.PI*2;a+=0.05){
      const r=lr+Math.sin(a*20+cwPhase)*3;
      const x=lcx+Math.cos(a)*r;const y=lcy+Math.sin(a)*r;
      if(a===0)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.stroke();
    // CCW beam (counter-clockwise)
    cx.strokeStyle='rgba(100,255,100,0.4)';cx.lineWidth=1.5;
    const ccwPhase=-t*3+phaseShift;
    cx.beginPath();
    for(let a=Math.PI*2;a>0;a-=0.05){
      const r=lr-3+Math.sin(a*20+ccwPhase)*3;
      const x=lcx+Math.cos(a)*r;const y=lcy+Math.sin(a)*r;
      if(a===Math.PI*2)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.stroke();
    // Rotation indicator
    cx.strokeStyle='rgba(255,200,0,0.3)';cx.lineWidth=1;
    const arrowA=t*0.5;
    cx.beginPath();cx.arc(lcx,lcy,lr+20,arrowA,arrowA+0.3);cx.stroke();
    cx.fillStyle='rgba(255,200,0,0.3)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('Rotation: '+rotRate+' deg/s',lcx,lcy-lr-12);
    cx.fillText('CW',lcx+lr+15,lcy-lr/2);cx.fillText('CCW',lcx-lr-15,lcy+lr/2);
  }

  function drawFringePattern(){
    const fx=W*0.65,fy=20,fw=W*0.32,fh=110;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(fx,fy,fw,fh);
    // Interference fringes
    for(let x=0;x<fw;x++){
      const phase=x/fw*Math.PI*10+phaseShift*5;
      const intensity=(Math.cos(phase)+1)/2;
      const r=Math.floor(intensity*200);
      const g=Math.floor(intensity*255);
      const b=Math.floor(intensity*100);
      cx.fillStyle='rgb('+r+','+g+','+b+')';
      cx.fillRect(fx+x,fy+20,1,fh-30);
    }
    cx.fillStyle='rgba(100,255,100,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('INTERFERENCE FRINGES',fx+8,fy+12);
    cx.fillText('Phase shift: '+phaseShift.toFixed(4)+' rad',fx+8,fy+fh+10);
  }

  function drawPhaseGraph(){
    const gx=W*0.65,gy=150,gw=W*0.32,gh=70;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(gx,gy,gw,gh);
    fringeHistory.push(phaseShift);
    if(fringeHistory.length>150)fringeHistory.shift();
    if(fringeHistory.length>1){
      cx.strokeStyle='rgba(100,255,100,0.5)';cx.lineWidth=1.5;cx.beginPath();
      const maxP=Math.max(...fringeHistory.map(Math.abs),0.01);
      const step=gw/Math.max(1,fringeHistory.length-1);
      fringeHistory.forEach((v,i)=>{
        const x=gx+i*step;const y=gy+gh/2-v/maxP*gh*0.4;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.strokeStyle='rgba(255,255,255,0.05)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(gx,gy+gh/2);cx.lineTo(gx+gw,gy+gh/2);cx.stroke();
    cx.fillStyle='rgba(100,255,100,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('SAGNAC PHASE vs TIME',gx+8,gy-4);
  }

  function drawMetrics(){
    const mx=W*0.65,my=230,mw=W*0.32,mh=55;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(mx,my,mw,mh);
    const beatFreq=(4*loopArea*rotRate*Math.PI/180)/(wavelength*1e-9*2*Math.PI*Math.sqrt(loopArea));
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('SAGNAC METRICS',mx+8,my+14);
    cx.fillStyle='#aaa';
    cx.fillText('lambda = '+wavelength+' nm  A = '+loopArea+' m^2',mx+8,my+28);
    cx.fillText('Beat freq: '+beatFreq.toFixed(2)+' Hz',mx+8,my+42);
    cx.fillText('Fringes: '+(phaseShift/(2*Math.PI)).toFixed(3),mx+8,my+54);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,210,42);
    cx.strokeStyle='rgba(100,255,100,0.15)';cx.strokeRect(8,8,210,42);
    cx.font='10px monospace';cx.fillStyle='#22c55e';cx.textAlign='left';
    cx.fillText('SAGNAC INTERFEROMETER',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Counter-Propagating Beam Rotation Sensor',16,40);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.12)';cx.fillRect(0,0,W,H);

    // Vary rotation
    rotRate=15+Math.sin(t*0.3)*10;
    phaseShift=8*Math.PI*loopArea*rotRate*Math.PI/180/(wavelength*1e-9*3e8);

    drawInterferometerLoop();drawFringePattern();
    drawPhaseGraph();drawMetrics();drawHUD();

    cx.fillStyle='rgba(100,255,100,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Sagnac Interferometer — Rotation Sensing with Counter-Propagating Beams',8,H-8);

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
