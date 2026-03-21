/**
 * Holographic Radio — Workshop DIY v1.0
 * Holographic principle applied to RF encoding on boundary surfaces
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"/><circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"><animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/></circle></svg>`;
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

const LANG={
  en:{
    ...LANG_BASE.en,title:'Holographic Radio',subtitle:'🌐 Holographic Radio — Boundary-encoded RF',disconnected:'Offline',connected:'Encoding',mainSection:'Holographic Radio',mainDesc:'Encode 3D RF information on 2D boundary surfaces',ready:'🌐 Holographic Radio ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'🌐 Encoding active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What is Holographic Radio?',faq_a1:'Holographic Radio lets you encode 3d rf information on 2d boundary surfaces. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you configure the physical constants and initial conditions for the experiment. Then you start the simulation and observe the physics phenomenon in action.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real physics experiments principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF / RPi. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Casimir Detector. Each app in this category teaches a different aspect of physics experiments.',demo_s1:'Welcome to Holographic Radio! Look at the main display — this is where the physics experiments simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of physics experiments.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how physics experiments works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches physics experiments concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Holographic Radio: Encode 3D RF information on 2D boundary surfaces. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Set Parameters through Run Experiment to Measure Results and Compare Theory.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Radio Holographique',subtitle:'🌐 Radio Holographique — RF encodé en frontière',disconnected:'Hors ligne',connected:'Encodage',mainSection:'Radio Holographique',mainDesc:'Encoder l\'information RF 3D sur des surfaces 2D',ready:'🌐 Radio Holographique prête!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 Thème →',simStarted:'🌐 Encodage actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Faraday Rotation Lab and Phys Em Drive Simulator ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'الراديو الهولوغرافي',subtitle:'🌐 الراديو الهولوغرافي — RF مشفر على الحدود',disconnected:'غير متصل',connected:'تشفير',mainSection:'الراديو الهولوغرافي',mainDesc:'تشفير معلومات RF ثلاثية الأبعاد على أسطح حدودية ثنائية',ready:'🌐 الراديو الهولوغرافي جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',langChanged:'🌐 العربية',themeChanged:'🎨 المظهر ←',simStarted:'🌐 التشفير نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Faraday Rotation Lab and Phys Em Drive Simulator! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='holographic-log.txt';a.click();}
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

/* ═══════ HOLOGRAPHIC SIM ═══════ */
let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const mode=$('modeSelect').value,res=+$('resSlider').value,dens=+$('densSlider').value/100;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,radius=130;

  if(mode==='boundary'||mode==='bulk'){
    // Boundary circle
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();
    // Boundary encoding cells
    for(let i=0;i<res;i++){
      const a=(i/res)*Math.PI*2+time*0.5;
      const bx=cx+Math.cos(a)*radius,by=cy+Math.sin(a)*radius;
      const val=Math.sin(a*3+time*2)*dens;
      ctx.fillStyle=`hsla(${200+val*60},70%,60%,${0.3+Math.abs(val)*0.5})`;
      ctx.beginPath();ctx.arc(bx,by,6,0,Math.PI*2);ctx.fill();
      // Radial connections to bulk
      if(mode==='bulk'){
        const depth=Math.abs(val)*radius*0.8;
        const ix=cx+Math.cos(a)*depth,iy=cy+Math.sin(a)*depth;
        ctx.strokeStyle=`rgba(100,200,255,${Math.abs(val)*0.2})`;ctx.lineWidth=0.5;
        ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ix,iy);ctx.stroke();
        ctx.fillStyle=`rgba(255,200,100,${Math.abs(val)*0.4})`;ctx.beginPath();ctx.arc(ix,iy,3,0,Math.PI*2);ctx.fill();
      }
    }
    // Interior reconstruction
    if(mode==='bulk'){
      for(let gx=-radius;gx<radius;gx+=15){for(let gy=-radius;gy<radius;gy+=15){
        if(gx*gx+gy*gy>radius*radius)continue;
        const val=Math.sin(gx*0.03+time)*Math.cos(gy*0.03+time*1.3)*dens;
        ctx.fillStyle=`rgba(100,150,255,${Math.abs(val)*0.15})`;ctx.fillRect(cx+gx-3,cy+gy-3,6,6);
      }}
    }
  } else if(mode==='entangle'){
    // Entanglement web
    const nodes=[];for(let i=0;i<res;i++){
      const a=(i/res)*Math.PI*2;nodes.push({x:cx+Math.cos(a)*radius,y:cy+Math.sin(a)*radius});
      nodes.push({x:cx+Math.cos(a+0.1)*radius*0.5,y:cy+Math.sin(a+0.1)*radius*0.5});
    }
    nodes.forEach((n,i)=>{
      for(let j=i+1;j<nodes.length;j++){
        const dist=Math.hypot(n.x-nodes[j].x,n.y-nodes[j].y);
        if(dist<150){
          const ent=Math.sin(time*2+i+j)*dens;
          ctx.strokeStyle=`rgba(150,100,255,${Math.abs(ent)*0.15})`;ctx.lineWidth=0.5;
          ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();
        }
      }
      ctx.fillStyle=accent;ctx.beginPath();ctx.arc(n.x,n.y,3,0,Math.PI*2);ctx.fill();
    });
  } else {
    // AdS/CFT - hyperbolic tiling
    for(let r=0;r<5;r++){
      const layerR=radius*(1-r*0.18);const nPts=res*(r+1)/2;
      ctx.strokeStyle=`rgba(100,200,255,${0.1+r*0.05})`;ctx.lineWidth=0.5;ctx.beginPath();ctx.arc(cx,cy,layerR,0,Math.PI*2);ctx.stroke();
      for(let i=0;i<nPts;i++){
        const a=(i/nPts)*Math.PI*2+time*(r+1)*0.1;
        const px=cx+Math.cos(a)*layerR,py=cy+Math.sin(a)*layerR;
        const val=Math.sin(a*5+time*3)*dens;
        ctx.fillStyle=`hsla(${220+r*30},60%,${50+val*20}%,${0.3+Math.abs(val)*0.4})`;
        ctx.beginPath();ctx.arc(px,py,3-r*0.3,0,Math.PI*2);ctx.fill();
      }
    }
  }

  const bitsB=(res*8*dens).toFixed(0),bitsV=(res*res*dens).toFixed(0);
  $('entropyVal').textContent=bitsB+' bits';$('bulkVal').textContent=bitsV+' bits';
  $('bekVal').textContent=(bitsB/(4*Math.PI*0.01)).toExponential(1)+' bits/m²';
  $('fidelVal').textContent=(85+dens*15).toFixed(1)+'%';

  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('HOLOGRAPHIC RADIO — '+mode.toUpperCase(),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('resSlider').value=24;$('resVal').textContent='24';$('densSlider').value=50;$('densVal').textContent='50%';$('modeSelect').value='boundary';
  $('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('entropyVal').textContent='-- bits';$('bulkVal').textContent='-- bits';$('bekVal').textContent='-- bits/m²';$('fidelVal').textContent='--%';log(LANG[currentLang].simReset,'info');}
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
  $('resSlider').oninput=function(){$('resVal').textContent=this.value;};
  $('densSlider').oninput=function(){$('densVal').textContent=this.value+'%';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Holographic Radio
   Animated holographic boundary encoding with bulk-boundary
   correspondence, information projection, and RF field mapping
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simHolographicRadio';let cv,cx,W,H,af=null,t=0;
  const boundaryBits=[];const bulkParticles=[];const projectionRays=[];
  const MAX_PARTICLES=60;const BOUNDARY_SIZE=100;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    for(let i=0;i<BOUNDARY_SIZE;i++)boundaryBits.push(Math.random()>0.5?1:0);
  }

  function drawBoundarySphere(){
    const scx=W*0.3,scy=H/2,sr=110;
    // Outer boundary (2D surface encoding)
    cx.strokeStyle='rgba(100,200,255,0.15)';cx.lineWidth=1;
    cx.beginPath();cx.arc(scx,scy,sr,0,Math.PI*2);cx.stroke();
    // Rotating boundary data
    const bits=BOUNDARY_SIZE;
    for(let i=0;i<bits;i++){
      const angle=i/bits*Math.PI*2+t*0.3;
      const x=scx+Math.cos(angle)*sr;
      const y=scy+Math.sin(angle)*sr;
      const bit=boundaryBits[i];
      cx.fillStyle=bit?'rgba(59,130,246,0.6)':'rgba(239,68,68,0.3)';
      cx.beginPath();cx.arc(x,y,2,0,Math.PI*2);cx.fill();
    }
    // Inner bulk (3D encoded info)
    cx.fillStyle='rgba(100,200,255,0.03)';
    cx.beginPath();cx.arc(scx,scy,sr,0,Math.PI*2);cx.fill();
    // Grid inside sphere
    cx.strokeStyle='rgba(100,200,255,0.04)';cx.lineWidth=0.5;
    for(let r=sr*0.25;r<sr;r+=sr*0.25){
      cx.beginPath();cx.arc(scx,scy,r,0,Math.PI*2);cx.stroke();
    }
    for(let a=0;a<Math.PI*2;a+=Math.PI/6){
      cx.beginPath();cx.moveTo(scx,scy);
      cx.lineTo(scx+Math.cos(a)*sr,scy+Math.sin(a)*sr);cx.stroke();
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('HOLOGRAPHIC BOUNDARY',scx,scy-sr-8);
    cx.fillText('Bulk Information',scx,scy+4);
  }

  function drawBulkParticles(){
    const scx=W*0.3,scy=H/2,sr=110;
    if(Math.random()<0.08&&bulkParticles.length<MAX_PARTICLES){
      const angle=Math.random()*Math.PI*2;
      const dist=Math.random()*sr*0.8;
      bulkParticles.push({x:scx+Math.cos(angle)*dist,y:scy+Math.sin(angle)*dist,
        vx:(Math.random()-.5)*0.5,vy:(Math.random()-.5)*0.5,
        life:80+Math.random()*120,age:0,hue:180+Math.random()*60});
    }
    for(let i=bulkParticles.length-1;i>=0;i--){
      const p=bulkParticles[i];
      p.age++;p.x+=p.vx;p.y+=p.vy;
      const dx=p.x-scx,dy=p.y-scy;
      if(Math.sqrt(dx*dx+dy*dy)>sr||p.age>p.life){bulkParticles.splice(i,1);continue;}
      const alpha=Math.sin(p.age/p.life*Math.PI)*0.6;
      cx.fillStyle='hsla('+p.hue+',60%,60%,'+alpha+')';
      cx.beginPath();cx.arc(p.x,p.y,1.5,0,Math.PI*2);cx.fill();
    }
  }

  function drawProjection(){
    const scx=W*0.3,scy=H/2,sr=110;
    const px=W*0.65,py=20,pw=W*0.32,ph=H-40;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(px,py,pw,ph);
    cx.strokeStyle='rgba(100,200,255,0.1)';cx.strokeRect(px,py,pw,ph);
    // Projection rays from boundary to screen
    for(let i=0;i<12;i++){
      const angle=i/12*Math.PI*2+t*0.2;
      const bx=scx+Math.cos(angle)*sr;
      const by=scy+Math.sin(angle)*sr;
      const tx=px+Math.random()*pw;
      const ty=py+Math.random()*ph;
      cx.strokeStyle='rgba(100,200,255,'+(0.03+Math.sin(t+i)*0.02)+')';
      cx.lineWidth=0.5;cx.beginPath();cx.moveTo(bx,by);cx.lineTo(tx,ty);cx.stroke();
    }
    // Projected RF pattern
    const cols=40,rows=30;
    const cellW=pw/cols,cellH=ph/rows;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const bitIdx=(r*cols+c+Math.floor(t*10))%BOUNDARY_SIZE;
        const val=boundaryBits[bitIdx];
        const interference=Math.sin(c*0.3+t*2)*Math.sin(r*0.3+t*1.5);
        const bright=val*0.4+interference*0.2+0.1;
        if(bright<0.1)continue;
        cx.fillStyle='hsla(200,70%,50%,'+(bright*0.5)+')';
        cx.fillRect(px+c*cellW,py+r*cellH,cellW-0.5,cellH-0.5);
      }
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('RF FIELD PROJECTION',px+pw/2,py-5);
  }

  function drawInfoMetrics(){
    const mx=20,my=H-70,mw=W*0.35,mh=55;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(mx,my,mw,mh);
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    const entropy=(3.2+Math.sin(t)*0.5).toFixed(2);
    const bits2=BOUNDARY_SIZE;
    const area=(4*Math.PI*110*110/4).toFixed(0);
    cx.fillText('Boundary Entropy: '+entropy+' bits/Planck area',mx+8,my+14);
    cx.fillText('Boundary Bits: '+bits2+'  Area: '+area+' px^2',mx+8,my+28);
    cx.fillText('Bulk Degrees of Freedom: '+bulkParticles.length,mx+8,my+42);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,220,54);
    cx.strokeStyle='rgba(100,200,255,0.15)';cx.strokeRect(8,8,220,54);
    cx.font='10px monospace';cx.fillStyle='#3b82f6';cx.textAlign='left';
    cx.fillText('HOLOGRAPHIC RADIO',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Bulk-Boundary Correspondence',16,40);
    cx.fillText('AdS/CFT RF Encoding Simulation',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.1)';cx.fillRect(0,0,W,H);

    // Slowly mutate boundary
    if(Math.floor(t*60)%15===0){
      const idx=Math.floor(Math.random()*BOUNDARY_SIZE);
      boundaryBits[idx]=boundaryBits[idx]?0:1;
    }

    drawBoundarySphere();drawBulkParticles();drawProjection();
    drawInfoMetrics();drawHUD();

    cx.fillStyle='rgba(100,200,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Holographic Principle — Boundary Surface RF Encoding',8,H-8);

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
