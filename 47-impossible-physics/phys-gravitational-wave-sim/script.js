/**
 * Gravitational Wave Simulator — Workshop DIY v1.0
 * Spacetime distortion and LIGO detector simulation
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q30 20 50 50 Q70 80 90 50" fill="none" stroke="currentColor" stroke-width="2"><animate attributeName="d" values="M10 50 Q30 20 50 50 Q70 80 90 50;M10 50 Q30 80 50 50 Q70 20 90 50;M10 50 Q30 20 50 50 Q70 80 90 50" dur="1.5s" repeatCount="indefinite"/></path></svg>`;
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
    ...LANG_BASE.en,title:'Gravitational Wave Sim',subtitle:'🌊 Gravitational Wave Sim — Spacetime ripples',disconnected:'Offline',connected:'Detecting',ready:'🌊 GW Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🌊 Detecting GW',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates impossible physics! 🔬 You get to experiment with exotic physical phenomena in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real exotic physical phenomena so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real cutting-edge physics simulations! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Phys Zero Point Meter and Phys Tunneling Radio! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},fr:{title:'Sim Ondes Gravitationnelles',subtitle:'🌊 Sim OG — Ondulations de l\'espace-temps',disconnected:'Hors ligne',connected:'Détection',ready:'🌊 Simulateur OG prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🌊 Détection OG',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Zero Point Meter and Phys Tunneling Radio ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},ar:{title:'محاكي الموجات الثقالية',subtitle:'🌊 محاكي الموجات الثقالية — تموجات الزمكان',disconnected:'غير متصل',connected:'يكشف',ready:'🌊 محاكي الموجات جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🌊 كشف الموجات',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Zero Point Meter and Phys Tunneling Radio! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='gw-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.015;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const src=$('srcSelect').value,mass=+$('massSlider').value,dist=+$('distSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const cx=w*0.35,cy=h*0.45;
  // Spacetime grid distorted by GW
  const strain=mass/(dist+1)*0.001;const gwFreq=src==='binary'?50+time*20:src==='pulsar'?10:src==='supernova'?200*Math.exp(-time*0.5):100*Math.exp(-time*0.3);
  const chirpFreq=src==='binary'?Math.min(gwFreq,500):gwFreq;
  ctx.strokeStyle='rgba(100,200,255,0.08)';ctx.lineWidth=0.5;
  const gridSize=25;
  for(let gx=0;gx<w;gx+=gridSize){for(let gy=0;gy<h*0.7;gy+=gridSize){
    const dx=gx-cx,dy=gy-cy,r=Math.sqrt(dx*dx+dy*dy)+1;
    const distort=strain*50*Math.sin(r*0.03-time*chirpFreq*0.05)/Math.sqrt(r*0.1+1);
    const px=gx+distort*dx/r,py=gy+distort*dy/r;
    ctx.beginPath();ctx.arc(px,py,1,0,Math.PI*2);ctx.stroke();
  }}
  // Binary merger visualization
  if(src==='binary'){
    const sep=30-Math.min(time*2,25);const orbitSpeed=time*5/(sep*0.1+0.5);
    const x1=cx+Math.cos(orbitSpeed)*sep,y1=cy+Math.sin(orbitSpeed)*sep;
    const x2=cx-Math.cos(orbitSpeed)*sep,y2=cy-Math.sin(orbitSpeed)*sep;
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(x1,y1,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x2,y2,8,0,Math.PI*2);ctx.fill();
    // Spiral waves
    for(let a=0;a<Math.PI*6;a+=0.1){const r=a*15+time*100;const wx=cx+Math.cos(a+time*2)*r,wy=cy+Math.sin(a+time*2)*r;
      if(wx>0&&wx<w&&wy>0&&wy<h*0.7){ctx.fillStyle=`rgba(100,200,255,${0.05-a*0.005})`;ctx.fillRect(wx,wy,2,2);}}
  } else {
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(cx,cy,12+Math.sin(time*5)*3,0,Math.PI*2);ctx.fill();
    for(let ring=1;ring<8;ring++){ctx.strokeStyle=`rgba(100,200,255,${0.15-ring*0.015})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,ring*30+time*50%30,0,Math.PI*2);ctx.stroke();}
  }
  // LIGO strain plot (bottom)
  const plotY=h*0.72,plotH=h*0.25;
  ctx.strokeStyle='rgba(100,200,255,0.15)';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(0,plotY+plotH/2);ctx.lineTo(w,plotY+plotH/2);ctx.stroke();
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let x=0;x<w;x+=2){
    let signal;const t2=(x/w)*10-time*5;
    if(src==='binary')signal=Math.sin(t2*chirpFreq*0.1)*Math.exp(Math.min(t2*0.3,2))*strain*plotH*80;
    else if(src==='ringdown')signal=Math.sin(t2*gwFreq*0.1)*Math.exp(-Math.abs(t2)*0.5)*strain*plotH*80;
    else signal=Math.sin(t2*gwFreq*0.1)*strain*plotH*80;
    signal+=(Math.random()-0.5)*2;// noise
    const y=plotY+plotH/2-signal;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='9px Orbitron';ctx.fillText('LIGO STRAIN',5,plotY+12);
  $('strainVal').textContent=(strain*1e-21).toExponential(2);$('gwFreqVal').textContent=chirpFreq.toFixed(0)+' Hz';
  $('chirpVal').textContent=(mass*0.87).toFixed(1)+' M☉';$('snrVal').textContent=(mass/Math.sqrt(dist)*10).toFixed(1);
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('GW DETECTOR — '+src.toUpperCase()+' h='+(strain*1e-21).toExponential(1),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();time=0;$('massSlider').value=30;$('massVal').textContent='30 M☉';$('distSlider').value=100;$('distVal').textContent='100 Mpc';$('srcSelect').value='binary';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('strainVal').textContent='--';$('gwFreqVal').textContent='-- Hz';$('chirpVal').textContent='-- M☉';$('snrVal').textContent='--';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('massSlider').oninput=function(){$('massVal').textContent=this.value+' M☉';};$('distSlider').oninput=function(){$('distVal').textContent=this.value+' Mpc';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Gravitational Wave Simulator
   Animated spacetime grid distortion with binary inspiral,
   LIGO interferometer arms, and strain waveform
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simGravWave';let cv,cx,W,H,af=null,t=0;
  let orbitPhase=0,orbitRadius=60,frequency=0.5,strain=0;
  const strainHistory=[];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#030408;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawSpacetimeGrid(){
    const gcx=W*0.35,gcy=H/2-10,gs=160;
    cx.strokeStyle='rgba(100,200,255,0.08)';cx.lineWidth=0.5;
    const gridSize=20;
    for(let gx=-gs;gx<=gs;gx+=gridSize){
      cx.beginPath();
      for(let gy=-gs;gy<=gs;gy+=4){
        const dx=gx-0,dy=gy-0;
        const dist=Math.sqrt(dx*dx+dy*dy)+1;
        const distort=strain*500/(dist+10);
        const stretch=gx*(1+distort*Math.cos(orbitPhase*2));
        const squeeze=gy*(1-distort*Math.cos(orbitPhase*2));
        const px=gcx+stretch;const py=gcy+squeeze;
        if(gy===-gs)cx.moveTo(px,py);else cx.lineTo(px,py);
      }
      cx.stroke();
    }
    for(let gy=-gs;gy<=gs;gy+=gridSize){
      cx.beginPath();
      for(let gx=-gs;gx<=gs;gx+=4){
        const dx=gx-0,dy=gy-0;
        const dist=Math.sqrt(dx*dx+dy*dy)+1;
        const distort=strain*500/(dist+10);
        const stretch=gx*(1+distort*Math.cos(orbitPhase*2));
        const squeeze=gy*(1-distort*Math.cos(orbitPhase*2));
        const px=gcx+stretch;const py=gcy+squeeze;
        if(gx===-gs)cx.moveTo(px,py);else cx.lineTo(px,py);
      }
      cx.stroke();
    }
  }

  function drawBinarySystem(){
    const bcx=W*0.35,bcy=H/2-10;
    const x1=bcx+Math.cos(orbitPhase)*orbitRadius;
    const y1=bcy+Math.sin(orbitPhase)*orbitRadius*0.4;
    const x2=bcx+Math.cos(orbitPhase+Math.PI)*orbitRadius;
    const y2=bcy+Math.sin(orbitPhase+Math.PI)*orbitRadius*0.4;
    // Orbit trail
    cx.strokeStyle='rgba(255,200,100,0.1)';cx.lineWidth=1;
    cx.beginPath();cx.ellipse(bcx,bcy,orbitRadius,orbitRadius*0.4,0,0,Math.PI*2);cx.stroke();
    // Stars
    const sz=6+4*(60/Math.max(20,orbitRadius));
    cx.save();cx.shadowColor='#f59e0b';cx.shadowBlur=10;
    cx.fillStyle='#f59e0b';cx.beginPath();cx.arc(x1,y1,sz,0,Math.PI*2);cx.fill();
    cx.fillStyle='#ef4444';cx.beginPath();cx.arc(x2,y2,sz*0.8,0,Math.PI*2);cx.fill();
    cx.restore();
    // Gravitational wave ripples
    for(let w=0;w<4;w++){
      const r=(t*80+w*40)%200;
      cx.strokeStyle='rgba(100,200,255,'+(0.08*(1-r/200))+')';cx.lineWidth=1;
      cx.beginPath();cx.arc(bcx,bcy,r,0,Math.PI*2);cx.stroke();
    }
  }

  function drawLIGO(){
    const lx=W*0.75,ly=50,ls=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(lx-ls-10,ly-10,ls*2+20,ls*2+20);
    // Beam splitter
    cx.fillStyle='rgba(100,200,255,0.3)';
    cx.save();cx.translate(lx,ly+ls);cx.rotate(Math.PI/4);
    cx.fillRect(-5,-8,10,16);cx.restore();
    // Arms
    const armStretch=strain*2000;
    cx.strokeStyle='rgba(100,255,100,0.4)';cx.lineWidth=3;
    cx.beginPath();cx.moveTo(lx,ly+ls);cx.lineTo(lx,ly+ls-ls*(1+armStretch));cx.stroke();
    cx.strokeStyle='rgba(255,100,100,0.4)';cx.lineWidth=3;
    cx.beginPath();cx.moveTo(lx,ly+ls);cx.lineTo(lx+ls*(1-armStretch),ly+ls);cx.stroke();
    // Mirrors
    cx.fillStyle='rgba(200,200,220,0.5)';
    cx.fillRect(lx-4,ly-5,8,6);cx.fillRect(lx+ls-3,ly+ls-4,6,8);
    // Laser source
    cx.fillStyle='rgba(255,0,0,0.3)';cx.beginPath();cx.arc(lx-ls,ly+ls,5,0,Math.PI*2);cx.fill();
    // Detector
    cx.fillStyle='rgba(0,255,0,0.3)';cx.beginPath();cx.arc(lx,ly+ls+ls,5,0,Math.PI*2);cx.fill();
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('LIGO INTERFEROMETER',lx,ly-15);
    cx.fillText('Laser',lx-ls,ly+ls+15);cx.fillText('Detector',lx,ly+ls+ls+15);
  }

  function drawStrainWaveform(){
    const wx=20,wy=H-80,ww=W-40,wh=60;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(wx,wy,ww,wh);
    cx.strokeStyle='rgba(255,255,255,0.05)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(wx,wy+wh/2);cx.lineTo(wx+ww,wy+wh/2);cx.stroke();
    if(strainHistory.length>1){
      cx.strokeStyle='rgba(100,200,255,0.6)';cx.lineWidth=1.5;cx.beginPath();
      const step=ww/Math.max(1,strainHistory.length-1);
      strainHistory.forEach((v,i)=>{
        const x=wx+i*step;const y=wy+wh/2-v*wh*200;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('STRAIN h(t) — Chirp Waveform',wx+8,wy-4);
    cx.fillText('h = '+strain.toExponential(2),wx+ww-100,wy-4);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,200,54);
    cx.strokeStyle='rgba(100,200,255,0.15)';cx.strokeRect(8,8,200,54);
    cx.font='10px monospace';cx.fillStyle='#3b82f6';cx.textAlign='left';
    cx.fillText('GRAVITATIONAL WAVE SIM',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Binary Inspiral + LIGO',16,40);
    cx.fillText('Orbit R: '+orbitRadius.toFixed(0)+'  f: '+frequency.toFixed(2)+' Hz',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(3,4,8,0.12)';cx.fillRect(0,0,W,H);

    // Inspiral: orbit shrinks, frequency increases
    frequency=0.5+t*0.02;
    orbitRadius=Math.max(15,60-t*0.8);
    orbitPhase+=frequency*0.1;
    strain=0.001*Math.pow(60/Math.max(15,orbitRadius),2)*Math.sin(orbitPhase*2);
    strainHistory.push(strain);
    if(strainHistory.length>400)strainHistory.shift();
    // Reset inspiral
    if(orbitRadius<=15){t=0;orbitRadius=60;frequency=0.5;strainHistory.length=0;}

    drawSpacetimeGrid();drawBinarySystem();drawLIGO();
    drawStrainWaveform();drawHUD();

    cx.fillStyle='rgba(100,200,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Gravitational Waves — Binary Inspiral Spacetime Distortion',8,H-8);

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
