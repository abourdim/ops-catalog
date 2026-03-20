/**
 * Faraday Rotation Lab — Workshop DIY v1.0
 * Polarization rotation through magnetized plasma
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"><animateTransform attributeName="transform" type="rotate" values="0 50 50;180 50 50;360 50 50" dur="3s" repeatCount="indefinite"/></ellipse></svg>`;
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
    ...LANG_BASE.en,title:'Faraday Rotation Lab',subtitle:'🧲 Faraday Rotation Lab — Polarization in B-fields',disconnected:'Offline',connected:'Rotating',ready:'🧲 Faraday Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🧲 Rotation active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates impossible physics! 🔬 You get to experiment with exotic physical phenomena in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real exotic physical phenomena so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real cutting-edge physics simulations! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Phys Superluminal Illusion and Phys Quantum Random Beacon! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},fr:{title:'Labo Rotation Faraday',subtitle:'🧲 Rotation Faraday — Polarisation en champ B',disconnected:'Hors ligne',connected:'Rotation',ready:'🧲 Labo Faraday prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🧲 Rotation active',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Superluminal Illusion and Phys Quantum Random Beacon ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},ar:{title:'مختبر دوران فاراداي',subtitle:'🧲 مختبر دوران فاراداي — الاستقطاب في المجالات المغناطيسية',disconnected:'غير متصل',connected:'يدور',ready:'🧲 مختبر فاراداي جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🧲 الدوران نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Superluminal Illusion and Phys Quantum Random Beacon! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='faraday-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const B=+$('bSlider').value/100,wl=+$('wlSlider').value,path=+$('pathSlider').value/10;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const rotation=B*path*2.63e4/(wl*wl)*0.01;// simplified Faraday rotation
  // Magnetized plasma region
  ctx.fillStyle='rgba(50,50,150,0.05)';ctx.fillRect(w*0.2,0,w*0.6,h);
  ctx.strokeStyle='rgba(100,150,255,0.2)';ctx.setLineDash([3,6]);ctx.strokeRect(w*0.2,0,w*0.6,h);ctx.setLineDash([]);
  // B-field arrows
  for(let y=30;y<h;y+=50){ctx.fillStyle=`rgba(100,200,255,${0.15+0.05*Math.sin(time+y*0.05)})`;ctx.font='16px serif';ctx.fillText('→',w*0.45,y);ctx.fillText('→',w*0.55,y);}
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='11px Orbitron';ctx.fillText('B = '+B.toFixed(2)+' T',w*0.45,20);
  // Input polarization (vertical)
  const polY=h/2;
  ctx.strokeStyle='rgba(100,200,255,0.6)';ctx.lineWidth=2;
  for(let x=0;x<w*0.2;x+=3){
    const amp=20*Math.sin(x*0.1-time*5);
    ctx.beginPath();ctx.moveTo(x,polY);ctx.lineTo(x,polY+amp*Math.cos(0));ctx.stroke();
  }
  // Rotating polarization through plasma
  ctx.strokeStyle=accent;ctx.lineWidth=2;
  for(let x=w*0.2;x<w*0.8;x+=3){
    const frac=(x-w*0.2)/(w*0.6);const angle=rotation*frac+time*0.5;
    const amp=20*Math.sin(x*0.1-time*5);
    ctx.beginPath();ctx.moveTo(x,polY);ctx.lineTo(x+amp*Math.sin(angle)*0.3,polY+amp*Math.cos(angle));ctx.stroke();
  }
  // Output polarization (rotated)
  ctx.strokeStyle='rgba(100,255,100,0.6)';ctx.lineWidth=2;
  for(let x=w*0.8;x<w;x+=3){
    const amp=20*Math.sin(x*0.1-time*5);
    ctx.beginPath();ctx.moveTo(x,polY);ctx.lineTo(x+amp*Math.sin(rotation)*0.3,polY+amp*Math.cos(rotation));ctx.stroke();
  }
  // Polarization ellipses
  const eR=40;
  [w*0.1,w*0.5,w*0.9].forEach((ex,i)=>{
    const angle=i===0?0:i===1?rotation*0.5:rotation;
    ctx.strokeStyle=i===2?'rgba(100,255,100,0.4)':i===1?accent+'80':'rgba(100,200,255,0.4)';
    ctx.lineWidth=1.5;ctx.beginPath();
    for(let a=0;a<Math.PI*2;a+=0.1){
      const px=ex+Math.cos(a)*eR*0.1*Math.cos(angle)-Math.sin(a)*eR*Math.sin(angle);
      const py=h*0.15+Math.cos(a)*eR*0.1*Math.sin(angle)+Math.sin(a)*eR*Math.cos(angle);
      a===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }ctx.closePath();ctx.stroke();
  });
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='9px Orbitron';ctx.fillText('INPUT',w*0.07,h*0.08);ctx.fillText('ROTATING',w*0.47,h*0.08);
  ctx.fillStyle='rgba(100,255,100,0.4)';ctx.fillText('OUTPUT',w*0.87,h*0.08);
  const rotDeg=(rotation*180/Math.PI);
  $('rotVal').textContent=rotDeg.toFixed(2)+'°';$('rmVal').textContent=(rotation/(path+0.01)).toFixed(2)+' rad/m²';
  $('neVal').textContent=(B*1e18).toExponential(1)+' /m³';$('verdetVal').textContent=(rotation/(B*path+0.001)).toFixed(4)+' rad/(T·m)';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('FARADAY ROTATION — Δθ='+rotDeg.toFixed(1)+'° B='+B.toFixed(2)+'T',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('bSlider').value=50;$('bVal').textContent='0.50 T';$('wlSlider').value=30;$('wlVal').textContent='30 cm';$('pathSlider').value=50;$('pathVal').textContent='5.0 m';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('rotVal').textContent='-- °';$('rmVal').textContent='-- rad/m²';$('neVal').textContent='-- /m³';$('verdetVal').textContent='-- rad/(T·m)';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('bSlider').oninput=function(){$('bVal').textContent=(this.value/100).toFixed(2)+' T';};$('wlSlider').oninput=function(){$('wlVal').textContent=this.value+' cm';};$('pathSlider').oninput=function(){$('pathVal').textContent=(this.value/10).toFixed(1)+' m';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Faraday Rotation Lab
   Animated polarization rotation through magnetized plasma with
   rotating E-field vector, magnetic field lines, and rotation angle
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simFaradayRotation';let cv,cx,W,H,af=null,t=0;
  let bField=0.5,wavelength=30,pathLength=5,rotAngle=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060812;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawMagneticField(){
    cx.strokeStyle='rgba(100,150,255,0.08)';cx.lineWidth=1;
    for(let y=-20;y<H+20;y+=30){
      cx.beginPath();
      for(let x=0;x<W;x+=5){
        const yy=y+Math.sin(x*0.02+t)*8;
        if(x===0)cx.moveTo(x,yy);else cx.lineTo(x,yy);
      }
      cx.stroke();
    }
    // B-field arrows
    for(let x=100;x<W-100;x+=120){
      cx.fillStyle='rgba(100,150,255,0.2)';cx.font='10px sans-serif';cx.textAlign='center';
      cx.fillText('B-->',x,25);
    }
  }

  function drawPlasmaRegion(){
    const px=200,py=40,pw=380,ph=H-80;
    cx.fillStyle='rgba(100,50,200,0.06)';cx.fillRect(px,py,pw,ph);
    cx.strokeStyle='rgba(100,50,200,0.15)';cx.lineWidth=1;cx.setLineDash([4,4]);
    cx.strokeRect(px,py,pw,ph);cx.setLineDash([]);
    // Plasma particles
    for(let i=0;i<40;i++){
      const x=px+Math.random()*pw;
      const y=py+Math.random()*ph;
      cx.fillStyle='rgba(150,100,255,'+(0.1+Math.random()*0.1)+')';
      cx.beginPath();cx.arc(x,y,1+Math.random(),0,Math.PI*2);cx.fill();
    }
    cx.fillStyle='rgba(150,100,255,0.3)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('MAGNETIZED PLASMA',px+pw/2,py-5);
  }

  function drawLightBeam(){
    const startX=30,endX=W-30,y=H/2;
    // Incoming polarized beam
    cx.strokeStyle='rgba(255,200,0,0.4)';cx.lineWidth=2;cx.beginPath();
    for(let x=startX;x<200;x+=3){
      const amp=15*Math.sin((x-startX)*0.1+t*5);
      cx.lineTo(x,y+amp);
    }
    cx.stroke();
    // Through plasma (rotating polarization)
    cx.strokeStyle='rgba(255,100,100,0.4)';cx.lineWidth=2;cx.beginPath();
    for(let x=200;x<580;x+=3){
      const progress=(x-200)/380;
      const currentRot=rotAngle*progress;
      const amp=15*Math.sin((x-200)*0.1+t*5)*Math.cos(currentRot);
      if(x===200)cx.moveTo(x,y+amp);else cx.lineTo(x,y+amp);
    }
    cx.stroke();
    // Outgoing rotated beam
    cx.strokeStyle='rgba(100,255,100,0.4)';cx.lineWidth=2;cx.beginPath();
    for(let x=580;x<endX;x+=3){
      const amp=15*Math.sin((x-580)*0.1+t*5)*Math.cos(rotAngle);
      if(x===580)cx.moveTo(x,y+amp);else cx.lineTo(x,y+amp);
    }
    cx.stroke();
  }

  function drawPolarizationVectors(){
    // Input polarization
    const inX=80,inY=H-60;
    cx.save();cx.translate(inX,inY);
    cx.strokeStyle='rgba(255,200,0,0.6)';cx.lineWidth=2;
    cx.beginPath();cx.moveTo(0,-20);cx.lineTo(0,20);cx.stroke();
    cx.beginPath();cx.moveTo(-2,-20);cx.lineTo(0,-25);cx.lineTo(2,-20);cx.fill();
    cx.fillStyle='rgba(255,200,0,0.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('INPUT',0,32);cx.restore();

    // Output polarization (rotated)
    const outX=W-80,outY=H-60;
    cx.save();cx.translate(outX,outY);cx.rotate(rotAngle);
    cx.strokeStyle='rgba(100,255,100,0.6)';cx.lineWidth=2;
    cx.beginPath();cx.moveTo(0,-20);cx.lineTo(0,20);cx.stroke();
    cx.beginPath();cx.moveTo(-2,-20);cx.lineTo(0,-25);cx.lineTo(2,-20);cx.fill();
    cx.restore();
    cx.fillStyle='rgba(100,255,100,0.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('OUTPUT',outX,outY+32);
    cx.fillText((rotAngle*180/Math.PI).toFixed(1)+'deg',outX,outY+42);
  }

  function drawRotationAngleGauge(){
    const gx=W-160,gy=30,gr=50;
    cx.strokeStyle='rgba(255,255,255,0.1)';cx.lineWidth=1;
    cx.beginPath();cx.arc(gx,gy+gr,gr,0,Math.PI*2);cx.stroke();
    // Angle arc
    cx.strokeStyle='rgba(100,255,100,0.5)';cx.lineWidth=3;
    cx.beginPath();cx.arc(gx,gy+gr,gr,-Math.PI/2,-Math.PI/2+rotAngle);cx.stroke();
    // Needle
    cx.strokeStyle='rgba(255,255,255,0.6)';cx.lineWidth=1.5;
    cx.beginPath();cx.moveTo(gx,gy+gr);
    cx.lineTo(gx+Math.cos(-Math.PI/2+rotAngle)*gr*0.9,gy+gr+Math.sin(-Math.PI/2+rotAngle)*gr*0.9);
    cx.stroke();
    cx.fillStyle='rgba(100,255,100,0.5)';cx.font='9px monospace';cx.textAlign='center';
    cx.fillText('ROTATION',(gx),gy+gr+gr+14);
    cx.fillText((rotAngle*180/Math.PI).toFixed(1)+' deg',gx,gy+gr);
  }

  function drawInfoPanel(){
    const px=20,py=20,pw=150,ph=70;
    cx.fillStyle='rgba(0,0,0,0.5)';cx.fillRect(px,py,pw,ph);
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('FARADAY ROTATION',px+8,py+14);
    cx.fillStyle='#aaa';
    cx.fillText('B = '+bField.toFixed(2)+' T',px+8,py+28);
    cx.fillText('lambda = '+wavelength+' cm',px+8,py+42);
    cx.fillText('Path = '+pathLength.toFixed(1)+' m',px+8,py+56);
    cx.fillText('theta = '+rotAngle.toFixed(3)+' rad',px+8,py+68);
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,18,0.12)';cx.fillRect(0,0,W,H);

    // Slowly vary parameters
    bField=0.5+Math.sin(t*0.2)*0.3;
    rotAngle=2.6*bField*pathLength*(wavelength/100)*(wavelength/100);

    drawMagneticField();drawPlasmaRegion();drawLightBeam();
    drawPolarizationVectors();drawRotationAngleGauge();drawInfoPanel();

    cx.fillStyle='rgba(150,100,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Faraday Rotation — Polarization Through Magnetized Plasma',8,H-8);

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
