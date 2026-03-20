/**
 * Doppler Cooling Simulator — Workshop DIY v1.0
 * Laser Doppler cooling of atoms visualization
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="5" fill="currentColor"><animate attributeName="r" values="3;8;3" dur="2s" repeatCount="indefinite"/></circle><line x1="10" y1="50" x2="40" y2="50" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="60" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="50" y1="10" x2="50" y2="40" stroke="currentColor" stroke-width="2" opacity=".4"/><line x1="50" y1="60" x2="50" y2="90" stroke="currentColor" stroke-width="2" opacity=".4"/></svg>`;
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
    ...LANG_BASE.en,title:'Doppler Cooling Sim',subtitle:'❄️ Doppler Cooling — Laser cooling to micro-Kelvin',disconnected:'Offline',connected:'Cooling',ready:'❄️ Doppler Cooling ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'❄️ Cooling active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates impossible physics! 🔬 You get to experiment with exotic physical phenomena in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real exotic physical phenomena so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real cutting-edge physics simulations! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Phys Metamaterial Simulator and Phys Holographic Radio! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},fr:{title:'Sim Refroidissement Doppler',subtitle:'❄️ Refroidissement Doppler — Micro-Kelvin par laser',disconnected:'Hors ligne',connected:'Refroidit',ready:'❄️ Refroidissement prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'❄️ Refroidissement actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Metamaterial Simulator and Phys Holographic Radio ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},ar:{title:'محاكي تبريد دوبلر',subtitle:'❄️ تبريد دوبلر — تبريد بالليزر إلى ميكرو كلفن',disconnected:'غير متصل',connected:'يبرّد',ready:'❄️ تبريد دوبلر جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'❄️ التبريد نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Metamaterial Simulator and Phys Holographic Radio! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='doppler-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0,temperature=300000;// start at 300mK in μK
const atoms=[];for(let i=0;i<200;i++)atoms.push({x:400+((Math.random()-.5)*300),y:175+((Math.random()-.5)*200),vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6});

function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const detune=+$('detuneSlider').value,power=+$('powerSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.1)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2;
  // Cooling rate
  const coolingRate=Math.abs(detune)*power*0.0001;temperature=Math.max(1,temperature*(1-coolingRate*0.01));
  const speedFactor=Math.sqrt(temperature/300000);
  // Laser beams (6 orthogonal)
  const beamAlpha=0.1+power*0.002;
  ctx.strokeStyle=`rgba(255,50,50,${beamAlpha})`;ctx.lineWidth=8;
  [[0,cy,w,cy],[cx,0,cx,h]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  ctx.strokeStyle=`rgba(255,50,50,${beamAlpha*0.5})`;ctx.lineWidth=4;
  [[0,cy-50,w,cy+50],[0,cy+50,w,cy-50]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();});
  // Atoms
  atoms.forEach(a=>{
    a.vx*=(1-coolingRate*0.005);a.vy*=(1-coolingRate*0.005);
    a.vx+=(Math.random()-.5)*speedFactor*0.5;a.vy+=(Math.random()-.5)*speedFactor*0.5;
    // Trap restoring force
    a.vx-=(a.x-cx)*0.0005;a.vy-=(a.y-cy)*0.0005;
    a.x+=a.vx*speedFactor;a.y+=a.vy*speedFactor;
    if(a.x<10||a.x>w-10)a.vx*=-0.9;if(a.y<10||a.y>h-10)a.vy*=-0.9;
    const speed=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
    const hue=240-speed*30;// blue=cold, red=hot
    ctx.fillStyle=`hsla(${Math.max(0,Math.min(240,hue))},80%,60%,0.7)`;
    ctx.beginPath();ctx.arc(a.x,a.y,3+speed*0.3,0,Math.PI*2);ctx.fill();
    // Photon absorption/emission flashes
    if(Math.random()<coolingRate*0.1&&speed>0.5){
      ctx.fillStyle='rgba(255,255,200,0.4)';ctx.beginPath();ctx.arc(a.x,a.y,8,0,Math.PI*2);ctx.fill();
    }
  });
  // MOT trap visualization
  ctx.strokeStyle=`rgba(100,200,255,${0.1+0.05*Math.sin(time*3)})`;ctx.lineWidth=1;ctx.setLineDash([4,4]);
  ctx.beginPath();ctx.arc(cx,cy,80*speedFactor+20,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  // Temperature display
  const tempStr=temperature>1000?(temperature/1000).toFixed(1)+' mK':temperature.toFixed(1)+' μK';
  ctx.fillStyle=accent;ctx.font='14px Orbitron';ctx.textAlign='center';ctx.fillText('T = '+tempStr,cx,30);
  ctx.textAlign='left';
  const dopLim={rb:146,cs:125,na:240,sr:770}[$('atomSelect').value]||146;
  $('tempVal').textContent=tempStr;$('dopLimVal').textContent=dopLim+' μK';
  $('atomCntVal').textContent=atoms.length;$('psdVal').textContent=(1/(temperature+1)*1e3).toExponential(2);
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('DOPPLER COOLING — T='+tempStr+' Δ='+detune+' MHz',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();temperature=300000;atoms.forEach(a=>{a.x=400+(Math.random()-.5)*300;a.y=175+(Math.random()-.5)*200;a.vx=(Math.random()-.5)*6;a.vy=(Math.random()-.5)*6;});$('detuneSlider').value=-15;$('detuneVal').textContent='-15 MHz';$('powerSlider').value=30;$('powerVal').textContent='30 mW';$('atomSelect').value='rb';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('tempVal').textContent='-- μK';$('dopLimVal').textContent='-- μK';$('atomCntVal').textContent='--';$('psdVal').textContent='--';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('detuneSlider').oninput=function(){$('detuneVal').textContent=this.value+' MHz';};$('powerSlider').oninput=function(){$('powerVal').textContent=this.value+' mW';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Doppler Cooling Simulator
   Animated laser cooling of atoms with counter-propagating beams,
   atom velocity distribution, and temperature evolution
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simDopplerCooling';let cv,cx,W,H,af=null,t=0;
  const atoms=[];const MAX_ATOMS=150;const laserPhotons=[];
  let temperature=300000,dopplerLimit=146;const tempHistory=[];

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#040608;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    for(let i=0;i<MAX_ATOMS;i++){
      atoms.push({x:W*0.35+(Math.random()-.5)*200,y:H/2+(Math.random()-.5)*150,
        vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,
        lastAbsorb:0,excited:false});
    }
  }

  function drawTrapRegion(){
    const tcx=W*0.35,tcy=H/2;
    cx.strokeStyle='rgba(255,50,50,0.1)';cx.lineWidth=1;cx.setLineDash([4,4]);
    cx.strokeRect(tcx-150,tcy-120,300,240);cx.setLineDash([]);
  }

  function drawLaserBeams(){
    const tcx=W*0.35,tcy=H/2;
    // Horizontal beams
    const beamAlpha=0.15+Math.sin(t*5)*0.05;
    cx.fillStyle='rgba(255,0,0,'+beamAlpha+')';
    cx.fillRect(0,tcy-2,tcx+150,4);
    cx.fillRect(tcx-150,tcy-2,W*0.35+150,4);
    // Vertical beams
    cx.fillStyle='rgba(255,0,0,'+beamAlpha+')';
    cx.fillRect(tcx-2,0,4,H);
    // Arrows showing beam direction
    cx.fillStyle='rgba(255,100,100,0.3)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('>>> LASER',80,tcy-8);
    cx.fillText('LASER <<<',tcx+220,tcy-8);
    // Photon packets along beams
    for(let i=0;i<6;i++){
      const px=(t*200+i*100)%(tcx+150);
      cx.fillStyle='rgba(255,100,100,0.4)';
      cx.beginPath();cx.arc(px,tcy,2,0,Math.PI*2);cx.fill();
      const px2=tcx+150-(t*200+i*100)%(tcx+150);
      cx.beginPath();cx.arc(px2,tcy,2,0,Math.PI*2);cx.fill();
    }
  }

  function updateAtoms(){
    const coolingRate=0.998;
    atoms.forEach(a=>{
      // Apply Doppler cooling effect
      if(Math.random()<0.05){
        const speed=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
        if(speed>0.3){
          a.vx*=coolingRate;a.vy*=coolingRate;
          a.excited=true;a.lastAbsorb=t;
        }
      }
      if(t-a.lastAbsorb>0.1)a.excited=false;
      a.x+=a.vx;a.y+=a.vy;
      // Soft boundary
      const tcx=W*0.35,tcy=H/2;
      if(a.x<tcx-145){a.x=tcx-145;a.vx*=-0.8;}
      if(a.x>tcx+145){a.x=tcx+145;a.vx*=-0.8;}
      if(a.y<tcy-115){a.y=tcy-115;a.vy*=-0.8;}
      if(a.y>tcy+115){a.y=tcy+115;a.vy*=-0.8;}
    });
    // Calculate temperature from kinetic energy
    let ke=0;atoms.forEach(a=>{ke+=a.vx*a.vx+a.vy*a.vy;});
    temperature=Math.max(dopplerLimit,ke/atoms.length*50000);
  }

  function drawAtoms(){
    atoms.forEach(a=>{
      const speed=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
      const hue=240-speed*40;
      if(a.excited){
        cx.save();cx.shadowColor='#ff6600';cx.shadowBlur=8;
        cx.fillStyle='rgba(255,150,0,0.7)';cx.beginPath();cx.arc(a.x,a.y,4,0,Math.PI*2);cx.fill();
        cx.restore();
      }else{
        cx.fillStyle='hsla('+hue+',60%,50%,0.6)';
        cx.beginPath();cx.arc(a.x,a.y,2+speed*0.5,0,Math.PI*2);cx.fill();
      }
    });
  }

  function drawVelocityDistribution(){
    const vx=W*0.72,vy=20,vw=W*0.26,vh=110;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(vx,vy,vw,vh);
    // Histogram of speeds
    const bins=30;const hist=new Array(bins).fill(0);
    atoms.forEach(a=>{
      const speed=Math.sqrt(a.vx*a.vx+a.vy*a.vy);
      const bin=Math.min(bins-1,Math.floor(speed/6*bins));
      hist[bin]++;
    });
    const maxH=Math.max(...hist,1);
    const barW=vw/bins;
    for(let i=0;i<bins;i++){
      const h2=hist[i]/maxH*vh*0.7;
      const hue=240-i/bins*200;
      cx.fillStyle='hsla('+hue+',60%,50%,0.5)';
      cx.fillRect(vx+i*barW,vy+vh-h2,barW-1,h2);
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('VELOCITY DISTRIBUTION',vx+8,vy+10);
    cx.fillText('0               v_max',vx+8,vy+vh+10);
  }

  function drawTemperatureGraph(){
    const gx=W*0.72,gy=H-110,gw=W*0.26,gh=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(gx,gy,gw,gh);
    tempHistory.push(temperature);
    if(tempHistory.length>200)tempHistory.shift();
    if(tempHistory.length>1){
      const maxT=Math.max(...tempHistory);
      cx.strokeStyle='rgba(255,100,50,0.6)';cx.lineWidth=1.5;cx.beginPath();
      const step=gw/Math.max(1,tempHistory.length-1);
      tempHistory.forEach((v,i)=>{
        const x=gx+i*step;const y=gy+gh-(v/maxT)*gh*0.85;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    // Doppler limit line
    const maxT=Math.max(...tempHistory,1);
    const limY=gy+gh-(dopplerLimit/maxT)*gh*0.85;
    cx.strokeStyle='rgba(0,255,100,0.3)';cx.lineWidth=1;cx.setLineDash([3,3]);
    cx.beginPath();cx.moveTo(gx,limY);cx.lineTo(gx+gw,limY);cx.stroke();
    cx.setLineDash([]);
    cx.fillStyle='rgba(0,255,100,0.3)';cx.font='6px monospace';cx.fillText('Doppler limit',gx+gw-60,limY-4);
    cx.fillStyle='rgba(255,100,50,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('TEMPERATURE vs TIME',gx+8,gy-4);
    cx.fillText('T = '+(temperature>1000?(temperature/1000).toFixed(0)+' mK':temperature.toFixed(0)+' uK'),gx+8,gy+gh+10);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,220,54);
    cx.strokeStyle='rgba(255,100,50,0.15)';cx.strokeRect(8,8,220,54);
    cx.font='10px monospace';cx.fillStyle='#ef4444';cx.textAlign='left';
    cx.fillText('DOPPLER COOLING SIMULATOR',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Atoms: '+atoms.length+'  T: '+(temperature>1e3?(temperature/1e3).toFixed(0)+'mK':temperature.toFixed(0)+'uK'),16,40);
    cx.fillText('Doppler Limit: '+dopplerLimit+' uK',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,8,0.12)';cx.fillRect(0,0,W,H);

    drawTrapRegion();drawLaserBeams();updateAtoms();drawAtoms();
    drawVelocityDistribution();drawTemperatureGraph();drawHUD();

    cx.fillStyle='rgba(255,100,50,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Doppler Cooling — Laser Atom Trapping & Velocity Reduction',8,H-8);

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
