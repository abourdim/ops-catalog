/**
 * Casimir Effect Detector — Workshop DIY v1.0
 * Vacuum force measurement between conducting plates
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="10" width="4" height="80" fill="currentColor" opacity=".6"/><rect x="66" y="10" width="4" height="80" fill="currentColor" opacity=".6"><animate attributeName="x" values="66;50;66" dur="3s" repeatCount="indefinite"/></rect></svg>`;
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
    ...LANG_BASE.en,title:'Casimir Effect Detector',subtitle:'⚡ Casimir Detector — Vacuum force measurement',disconnected:'Offline',connected:'Measuring',ready:'⚡ Casimir Detector ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'⚡ Measuring Casimir force',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What is Casimir Effect Detector?',faq_a1:'Casimir Effect Detector lets you ⚡ casimir detector — vacuum force measurement. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real physics experiments behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real physics experiments principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Doppler Cooling Sim. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Casimir Effect Detector! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how physics experiments works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Casimir Effect Detector?',wiki_concept:'Casimir Effect Detector is a technique used in physics experiments. Casimir Effect Detector simulates real-world behavior. In professional settings, this technology requires HackRF / RPi and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the physical constants and initial conditions for the experiment. Second: Start the simulation and observe the physics phenomenon in action. The simulation runs these stages in real time, showing you intermediate results at each step. In real physics experiments, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Casimir Effect Detector has practical applications in physics experiments. Professionals use similar techniques with HackRF / RPi in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Casimir Effect Detector: ⚡ Casimir Detector — Vacuum force measurement. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Set Parameters through Run Experiment to Measure Results and Compare Theory.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},fr:{title:'Détecteur Effet Casimir',subtitle:'⚡ Détecteur Casimir — Mesure de force du vide',disconnected:'Hors ligne',connected:'Mesure',ready:'⚡ Détecteur Casimir prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'⚡ Mesure en cours',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Radio Black Hole and Phys Quantum Random Beacon ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},ar:{title:'كاشف تأثير كازيمير',subtitle:'⚡ كاشف كازيمير — قياس قوة الفراغ',disconnected:'غير متصل',connected:'يقيس',ready:'⚡ كاشف كازيمير جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'⚡ قياس قوة كازيمير',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Radio Black Hole and Phys Quantum Random Beacon! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='casimir-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const sep=+$('sepSlider').value,area=+$('areaSlider').value,temp=+$('tempSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);
  const plateGap=sep/1000*w*0.3+30;const plateL=w*0.35,plateR=plateL+plateGap;
  // Plates
  ctx.fillStyle='rgba(180,180,200,0.8)';ctx.fillRect(plateL-4,h*0.1,8,h*0.8);ctx.fillRect(plateR-4,h*0.1,8,h*0.8);
  ctx.fillStyle=accent;ctx.font='10px Orbitron';ctx.fillText('d = '+sep+' nm',plateL,h*0.05);
  // Vacuum modes INSIDE (restricted)
  const maxModes=Math.floor(sep/50)+1;
  for(let m=1;m<=Math.min(maxModes,8);m++){
    const waveLen=plateGap/m;ctx.strokeStyle=`hsla(${200+m*20},70%,60%,${0.15+0.05*Math.sin(time*m)})`;ctx.lineWidth=1;ctx.beginPath();
    for(let y=h*0.1;y<h*0.9;y+=2){const x=plateL+plateGap/2+Math.sin(y/waveLen*Math.PI*2+time*m)*plateGap*0.3/m;ctx.lineTo(x,y);}ctx.stroke();
  }
  // Vacuum modes OUTSIDE (unrestricted - more dense)
  for(let m=1;m<=15;m++){
    const waveLen=20+m*5;
    // Left side
    ctx.strokeStyle=`rgba(100,200,255,${0.05+0.02*Math.sin(time*m)})`;ctx.lineWidth=0.5;ctx.beginPath();
    for(let y=h*0.1;y<h*0.9;y+=3){const x=plateL*0.5+Math.sin(y/waveLen*Math.PI*2+time*m*0.5)*30;ctx.lineTo(x,y);}ctx.stroke();
    // Right side
    ctx.beginPath();for(let y=h*0.1;y<h*0.9;y+=3){const x=plateR+(w-plateR)*0.5+Math.sin(y/waveLen*Math.PI*2+time*m*0.5)*30;ctx.lineTo(x,y);}ctx.stroke();
  }
  // Force arrows (attractive)
  const forceScale=1/(sep*sep)*5000;
  for(let y=h*0.2;y<h*0.8;y+=40){
    ctx.fillStyle=`rgba(255,100,100,${0.3+0.1*Math.sin(time*3+y*0.05)})`;ctx.font='14px sans-serif';
    ctx.fillText('→',plateL+10,y);ctx.fillText('←',plateR-20,y);
  }
  // Force gauge (bottom)
  const gaugeW=w*0.6,gaugeX=w*0.2,gaugeY=h*0.92;
  ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(gaugeX,gaugeY);ctx.lineTo(gaugeX+gaugeW,gaugeY);ctx.stroke();
  const needleX=gaugeX+Math.min(forceScale/10,1)*gaugeW+Math.random()*2;
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(needleX,gaugeY-8);ctx.lineTo(needleX,gaugeY+8);ctx.stroke();
  // Virtual particle pairs popping in/out
  for(let i=0;i<5;i++){
    const px=plateL+Math.random()*plateGap,py=h*0.1+Math.random()*h*0.8;
    const flash=Math.random();
    if(flash>0.7){ctx.fillStyle=`rgba(255,200,100,${flash*0.3})`;ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px+5,py,2,0,Math.PI*2);ctx.fill();}
  }
  // Casimir force: F = -π²ℏc / (240 d⁴) * A
  const hbar=1.055e-34,cLight=3e8;
  const d_m=sep*1e-9,A_m=area*1e-12;
  const F=Math.PI*Math.PI*hbar*cLight/(240*Math.pow(d_m,4))*A_m;
  const P=F/A_m;const E=Math.PI*Math.PI*hbar*cLight/(720*Math.pow(d_m,3));
  $('forceVal').textContent=F.toExponential(2)+' N';$('pressVal').textContent=P.toExponential(2)+' Pa';
  $('edensVal').textContent=E.toExponential(2)+' J/m³';$('deflVal').textContent=(F*1e15).toFixed(2)+' pm';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('CASIMIR DETECTOR — d='+sep+'nm F='+F.toExponential(1)+' N',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('sepSlider').value=200;$('sepVal').textContent='200 nm';$('areaSlider').value=50;$('areaVal').textContent='50 μm²';$('tempSlider').value=300;$('tempVal').textContent='300 K';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('forceVal').textContent='-- N';$('pressVal').textContent='-- Pa';$('edensVal').textContent='-- J/m³';$('deflVal').textContent='-- pm';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('sepSlider').oninput=function(){$('sepVal').textContent=this.value+' nm';};$('areaSlider').oninput=function(){$('areaVal').textContent=this.value+' μm²';};$('tempSlider').oninput=function(){$('tempVal').textContent=this.value+' K';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Casimir Effect Detector
   Animated parallel conducting plates with vacuum mode exclusion,
   virtual photon visualization, and force measurement
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCasimirDetector';let cv,cx,W,H,af=null,t=0;
  const virtualPhotons=[];const MAX_PHOTONS=100;
  let plateSep=200,plateArea=50,temperature=300,casimirForce=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  class VirtualPhoton{
    constructor(region){
      this.region=region;
      if(region==='between'){
        this.x=W/2-30+Math.random()*60;this.y=40+Math.random()*(H-80);
      }else{
        this.x=region==='left'?50+Math.random()*120:W-170+Math.random()*120;
        this.y=40+Math.random()*(H-80);
      }
      this.vx=(Math.random()-.5)*1.5;this.vy=(Math.random()-.5)*1.5;
      this.wavelength=region==='between'?(10+Math.random()*40):(5+Math.random()*60);
      this.life=40+Math.random()*60;this.age=0;
      this.hue=region==='between'?200:280;
    }
    update(){
      this.age++;this.x+=this.vx;this.y+=this.vy;
      // Bounce off boundaries
      if(this.region==='between'){
        const leftPlate=W/2-plateSep/8;const rightPlate=W/2+plateSep/8;
        if(this.x<leftPlate||this.x>rightPlate)this.vx*=-1;
      }
      if(this.y<40||this.y>H-40)this.vy*=-1;
      return this.age<this.life;
    }
    draw(){
      const alpha=Math.sin(this.age/this.life*Math.PI)*0.5;
      const r=1+this.wavelength/30;
      cx.fillStyle='hsla('+this.hue+',60%,60%,'+alpha+')';
      cx.beginPath();cx.arc(this.x,this.y,r,0,Math.PI*2);cx.fill();
      // Wave oscillation
      cx.strokeStyle='hsla('+this.hue+',60%,60%,'+(alpha*0.3)+')';cx.lineWidth=0.5;
      cx.beginPath();
      cx.arc(this.x,this.y,r+3+Math.sin(t*5+this.age)*2,0,Math.PI*2);cx.stroke();
    }
  }

  function drawPlates(){
    const leftX=W/2-plateSep/8;const rightX=W/2+plateSep/8;
    const py=30,ph=H-60;
    // Left plate
    cx.fillStyle='rgba(180,180,200,0.3)';cx.fillRect(leftX-3,py,6,ph);
    cx.strokeStyle='rgba(200,200,220,0.4)';cx.strokeRect(leftX-3,py,6,ph);
    // Right plate
    cx.fillStyle='rgba(180,180,200,0.3)';cx.fillRect(rightX-3,py,6,ph);
    cx.strokeStyle='rgba(200,200,220,0.4)';cx.strokeRect(rightX-3,py,6,ph);
    // Force arrows (plates attract)
    cx.strokeStyle='rgba(255,200,0,0.4)';cx.lineWidth=1.5;
    const acy=H/2;
    cx.beginPath();cx.moveTo(leftX-30,acy);cx.lineTo(leftX-3,acy);cx.stroke();
    cx.beginPath();cx.moveTo(leftX-3,acy-3);cx.lineTo(leftX-8,acy);cx.lineTo(leftX-3,acy+3);cx.fill();
    cx.beginPath();cx.moveTo(rightX+30,acy);cx.lineTo(rightX+3,acy);cx.stroke();
    cx.beginPath();cx.moveTo(rightX+3,acy-3);cx.lineTo(rightX+8,acy);cx.lineTo(rightX+3,acy+3);cx.fill();
    // Separation label
    cx.fillStyle='rgba(255,200,0,0.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText(plateSep+' nm',W/2,py-8);
    cx.fillText('<-- F_Casimir -->',W/2,acy-15);
  }

  function drawModeExclusion(){
    const leftX=W/2-plateSep/8;const rightX=W/2+plateSep/8;
    const gap=rightX-leftX;
    // Standing wave modes that fit between plates
    const maxModes=Math.floor(gap/15);
    for(let n=1;n<=Math.min(maxModes,5);n++){
      const wl=2*gap/n;
      cx.strokeStyle='rgba(100,200,255,'+(0.08/n)+')';cx.lineWidth=1;
      cx.beginPath();
      for(let y=30;y<H-30;y+=3){
        const x=leftX+gap/2+Math.sin(y/wl*Math.PI*2+t*2)*gap*0.3/n;
        if(y===30)cx.moveTo(x,y);else cx.lineTo(x,y);
      }
      cx.stroke();
    }
  }

  function drawForceGraph(){
    const gx=20,gy=H-90,gw=200,gh=70;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(gx,gy,gw,gh);
    // F ~ 1/d^4 curve
    cx.strokeStyle='rgba(255,200,0,0.5)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<gw;i++){
      const d=50+i/gw*400;
      const f=1e8/Math.pow(d,4);
      const y=gy+gh-Math.min(gh*0.9,f*gh*1000);
      if(i===0)cx.moveTo(gx+i,y);else cx.lineTo(gx+i,y);
    }
    cx.stroke();
    // Current position marker
    const markerX=gx+(plateSep-50)/400*gw;
    cx.strokeStyle='rgba(255,255,255,0.4)';cx.lineWidth=1;
    cx.beginPath();cx.moveTo(markerX,gy);cx.lineTo(markerX,gy+gh);cx.stroke();
    cx.fillStyle='rgba(255,200,0,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('CASIMIR FORCE vs SEPARATION',gx+8,gy-4);
    cx.fillText('F ~ 1/d^4',gx+8,gy+gh+10);
  }

  function drawMetrics(){
    const mx=W-200,my=20,mw=180,mh=90;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(mx,my,mw,mh);
    casimirForce=Math.PI*Math.PI/(240)*1/(Math.pow(plateSep*1e-9,4))*plateArea*1e-12;
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('CASIMIR DETECTOR',mx+8,my+14);
    cx.fillStyle='#aaa';
    cx.fillText('Sep: '+plateSep+' nm',mx+8,my+30);
    cx.fillText('Area: '+plateArea+' um^2',mx+8,my+44);
    cx.fillText('Temp: '+temperature+' K',mx+8,my+58);
    cx.fillText('Force: '+(casimirForce*1e12).toExponential(2)+' pN',mx+8,my+72);
    cx.fillText('Deflection: '+(casimirForce*1e15).toFixed(1)+' pm',mx+8,my+84);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,210,42);
    cx.strokeStyle='rgba(100,200,255,0.15)';cx.strokeRect(8,8,210,42);
    cx.font='10px monospace';cx.fillStyle='#3b82f6';cx.textAlign='left';
    cx.fillText('CASIMIR EFFECT DETECTOR',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Vacuum Force Between Plates',16,40);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.1)';cx.fillRect(0,0,W,H);

    // Oscillate plate separation
    plateSep=200+Math.sin(t*0.3)*80;

    // Spawn virtual photons
    if(Math.random()<0.15)virtualPhotons.push(new VirtualPhoton('between'));
    if(Math.random()<0.08)virtualPhotons.push(new VirtualPhoton('left'));
    if(Math.random()<0.08)virtualPhotons.push(new VirtualPhoton('right'));

    while(virtualPhotons.length>MAX_PHOTONS)virtualPhotons.shift();
    for(let i=virtualPhotons.length-1;i>=0;i--){
      if(!virtualPhotons[i].update())virtualPhotons.splice(i,1);
      else virtualPhotons[i].draw();
    }

    drawModeExclusion();drawPlates();drawForceGraph();drawMetrics();drawHUD();

    cx.fillStyle='rgba(100,200,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Casimir Effect — Vacuum Mode Exclusion Between Conducting Plates',8,H-8);

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
