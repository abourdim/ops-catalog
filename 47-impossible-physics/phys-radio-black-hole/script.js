/**
 * Radio Black Hole — Workshop DIY v1.0
 * EM wave absorption and Hawking radiation near black hole analogs
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="15" fill="currentColor"/><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1" opacity=".3" stroke-dasharray="3,3"><animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Radio Black Hole',subtitle:'🕳️ Radio Black Hole — EM event horizon',disconnected:'Offline',connected:'Active',ready:'🕳️ Radio Black Hole ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'🕳️ Black hole active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates impossible physics! 🔬 You get to experiment with exotic physical phenomena in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real exotic physical phenomena so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real cutting-edge physics simulations! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Phys Faraday Rotation Lab and Phys Tunneling Radio! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},fr:{title:'Trou Noir Radio',subtitle:'🕳️ Trou Noir Radio — Horizon des événements EM',disconnected:'Hors ligne',connected:'Actif',ready:'🕳️ Trou Noir prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🕳️ Trou noir actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Faraday Rotation Lab and Phys Tunneling Radio ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},ar:{title:'الثقب الأسود الراديوي',subtitle:'🕳️ الثقب الأسود — أفق الحدث الكهرومغناطيسي',disconnected:'غير متصل',connected:'نشط',ready:'🕳️ الثقب الأسود جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🕳️ الثقب الأسود نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Faraday Rotation Lab and Phys Tunneling Radio! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='blackhole-log.txt';a.click();}
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

/* ═══════ BLACK HOLE SIM ═══════ */
let running=false,animFrame=null,time=0;
const particles=[];for(let i=0;i<400;i++)particles.push({a:Math.random()*Math.PI*2,r:50+Math.random()*300,v:0.5+Math.random()*2,size:Math.random()*2+0.5,hue:Math.random()*60+180});

function drawSim(){
  if(!running)return;time+=0.015;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const mass=+$('massSlider').value,freq=+$('freqSlider').value,mode=$('modeSelect').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,rs=mass*0.5+5;

  // Event horizon
  const grad=ctx.createRadialGradient(cx,cy,rs*0.5,cx,cy,rs*3);
  grad.addColorStop(0,'rgba(0,0,0,1)');grad.addColorStop(0.3,'rgba(0,0,0,0.8)');grad.addColorStop(1,'transparent');
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,rs*3,0,Math.PI*2);ctx.fill();
  // Black hole core
  ctx.fillStyle='#000';ctx.beginPath();ctx.arc(cx,cy,rs,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,rs,0,Math.PI*2);ctx.stroke();

  if(mode==='accretion'||mode==='spaghetti'){
    // Accretion disk particles spiraling in
    particles.forEach(p=>{
      p.a+=p.v/(p.r+10)*0.3;p.r-=0.1*(mass/50)/(p.r/(rs*3)+0.1);
      if(p.r<rs){p.r=50+Math.random()*300;p.a=Math.random()*Math.PI*2;p.v=0.5+Math.random()*2;}
      const px=cx+Math.cos(p.a)*p.r,py=cy+Math.sin(p.a)*p.r*0.35;
      const temp=Math.max(0,1-p.r/(rs*6));
      if(mode==='spaghetti'&&p.r<rs*2){
        const stretch=1+(rs*2-p.r)/(rs)*3;
        ctx.fillStyle=`hsla(${p.hue-temp*100},80%,${50+temp*40}%,${0.3+temp*0.5})`;
        ctx.fillRect(px-1,py-stretch*2,2,stretch*4);
      } else {
        ctx.fillStyle=`hsla(${p.hue-temp*100},80%,${50+temp*40}%,${0.3+temp*0.5})`;
        ctx.beginPath();ctx.arc(px,py,p.size+temp*2,0,Math.PI*2);ctx.fill();
      }
    });
  }
  if(mode==='hawking'){
    // Hawking radiation - particles escaping
    for(let i=0;i<8;i++){
      const a=time*2+i*Math.PI/4;const r=rs+5+Math.abs(Math.sin(time*3+i))*80;
      const px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;
      ctx.fillStyle=`rgba(255,220,100,${0.3+0.3*Math.sin(time*5+i)})`;
      ctx.beginPath();ctx.arc(px,py,2+Math.sin(time*4+i),0,Math.PI*2);ctx.fill();
      // Trail
      for(let j=0;j<5;j++){const tr=r-j*8;if(tr>rs){
        ctx.fillStyle=`rgba(255,220,100,${0.1-j*0.02})`;ctx.beginPath();ctx.arc(cx+Math.cos(a)*tr,cy+Math.sin(a)*tr,1,0,Math.PI*2);ctx.fill();
      }}
    }
    ctx.fillStyle='rgba(255,220,100,0.4)';ctx.font='10px Orbitron';ctx.fillText('HAWKING RADIATION',cx+rs+20,cy-20);
  }
  if(mode==='lensing'){
    // Einstein ring / gravitational lensing
    for(let i=0;i<30;i++){
      const srcAngle=(i/30)*Math.PI*2;const srcDist=200;
      const srcX=cx+Math.cos(srcAngle)*srcDist,srcY=cy+Math.sin(srcAngle)*srcDist;
      const dx=srcX-cx,dy=srcY-cy,dist=Math.sqrt(dx*dx+dy*dy);
      const deflection=rs*4/(dist+1);
      const lensX=srcX+dx/dist*deflection*10,lensY=srcY+dy/dist*deflection*10;
      ctx.fillStyle=`rgba(100,200,255,${0.2+0.1*Math.sin(time+i)})`;
      ctx.beginPath();ctx.arc(lensX,lensY,2,0,Math.PI*2);ctx.fill();
    }
    // Einstein ring
    ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,rs*2.5+Math.sin(time)*5,0,Math.PI*2);ctx.stroke();
  }

  const rsKm=(mass*2.95).toFixed(1);const hawkT=(6.17e-8/mass*50).toExponential(2);
  const redshift=(1/Math.sqrt(1-rs/(rs*2+10))).toFixed(4);
  $('rsVal').textContent=rsKm+' km';$('hawkTVal').textContent=hawkT+' K';
  $('redshiftVal').textContent='z = '+redshift;$('tidalVal').textContent=(mass*1e10/Math.pow(rs,3)).toExponential(1)+' N/m';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('RADIO BLACK HOLE — '+mode.toUpperCase()+' M='+mass+' M☉',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('massSlider').value=50;$('massVal').textContent='50 M☉';$('freqSlider').value=500;$('freqVal').textContent='500 MHz';$('modeSelect').value='accretion';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('rsVal').textContent='-- km';$('hawkTVal').textContent='-- K';$('redshiftVal').textContent='--';$('tidalVal').textContent='-- N/m';log(LANG[currentLang].simReset,'info');}
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
  $('massSlider').oninput=function(){$('massVal').textContent=this.value+' M☉';};$('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' MHz';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Radio Black Hole
   Animated gravitational lensing of EM waves, Hawking radiation,
   accretion disk, and photon sphere visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simRadioBlackHole';let cv,cx,W,H,af=null,t=0;
  const photons=[];const hawkingParticles=[];const accretionRings=[];
  const MAX_PHOTONS=120;let bhMass=10;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#020206;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  class Photon{
    constructor(){
      this.x=Math.random()*W*0.3;this.y=Math.random()*H;
      this.vx=1.5+Math.random();this.vy=(Math.random()-.5)*0.5;
      this.trail=[];this.absorbed=false;this.age=0;
      this.freq=Math.random();this.hue=30+this.freq*30;
    }
    update(){
      this.age++;
      const bhx=W*0.5,bhy=H/2;
      const dx=bhx-this.x,dy=bhy-this.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const rs=20*bhMass/10;
      if(dist<rs){this.absorbed=true;return false;}
      const force=500/(dist*dist+100);
      this.vx+=dx/dist*force;this.vy+=dy/dist*force;
      const speed=Math.sqrt(this.vx*this.vx+this.vy*this.vy);
      if(speed>4){this.vx*=4/speed;this.vy*=4/speed;}
      this.x+=this.vx;this.y+=this.vy;
      this.trail.push({x:this.x,y:this.y});
      if(this.trail.length>30)this.trail.shift();
      return this.x>0&&this.x<W&&this.y>0&&this.y<H&&this.age<400;
    }
    draw(){
      if(this.trail.length>1){
        cx.strokeStyle='hsla('+this.hue+',80%,60%,0.3)';cx.lineWidth=1;cx.beginPath();
        this.trail.forEach((p,i)=>{if(i===0)cx.moveTo(p.x,p.y);else cx.lineTo(p.x,p.y);});
        cx.stroke();
      }
      cx.fillStyle='hsla('+this.hue+',80%,70%,0.8)';
      cx.beginPath();cx.arc(this.x,this.y,1.5,0,Math.PI*2);cx.fill();
    }
  }

  class HawkingParticle{
    constructor(){
      const bhx=W*0.5,bhy=H/2,rs=20*bhMass/10;
      const angle=Math.random()*Math.PI*2;
      this.x=bhx+Math.cos(angle)*(rs+2);
      this.y=bhy+Math.sin(angle)*(rs+2);
      this.vx=Math.cos(angle)*(0.5+Math.random()*1);
      this.vy=Math.sin(angle)*(0.5+Math.random()*1);
      this.life=60+Math.random()*80;this.age=0;
    }
    update(){this.age++;this.x+=this.vx;this.y+=this.vy;return this.age<this.life;}
    draw(){
      const alpha=1-this.age/this.life;
      cx.fillStyle='rgba(255,200,100,'+alpha*0.6+')';
      cx.beginPath();cx.arc(this.x,this.y,1,0,Math.PI*2);cx.fill();
    }
  }

  function drawBlackHole(){
    const bhx=W*0.5,bhy=H/2,rs=20*bhMass/10;
    // Event horizon
    cx.save();
    const grad=cx.createRadialGradient(bhx,bhy,rs*0.5,bhx,bhy,rs*3);
    grad.addColorStop(0,'rgba(0,0,0,1)');grad.addColorStop(0.3,'rgba(0,0,0,0.8)');
    grad.addColorStop(0.6,'rgba(20,0,40,0.3)');grad.addColorStop(1,'rgba(0,0,0,0)');
    cx.fillStyle=grad;cx.beginPath();cx.arc(bhx,bhy,rs*3,0,Math.PI*2);cx.fill();
    // Hard event horizon
    cx.fillStyle='#000';cx.beginPath();cx.arc(bhx,bhy,rs,0,Math.PI*2);cx.fill();
    // Photon sphere
    cx.strokeStyle='rgba(255,200,100,0.15)';cx.lineWidth=1;cx.setLineDash([3,5]);
    cx.beginPath();cx.arc(bhx,bhy,rs*1.5,0,Math.PI*2);cx.stroke();cx.setLineDash([]);
    cx.restore();
    // Accretion disk
    cx.save();cx.translate(bhx,bhy);cx.scale(1,0.3);
    for(let r=rs*1.8;r<rs*4;r+=3){
      const bright=0.15*(1-r/(rs*4));
      const hue=30+r;
      cx.strokeStyle='hsla('+hue+',80%,50%,'+bright+')';cx.lineWidth=2;
      cx.beginPath();cx.arc(0,0,r,0,Math.PI*2);cx.stroke();
    }
    cx.restore();
  }

  function drawGravitationalLensing(){
    const bhx=W*0.5,bhy=H/2;
    // Background stars being lensed
    for(let i=0;i<20;i++){
      const sx=W*0.7+Math.sin(i*1.7)*W*0.25;
      const sy=H*0.1+Math.sin(i*2.3)*H*0.8;
      const dx=bhx-sx,dy=bhy-sy;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const deflection=200/(dist+50);
      const lx=sx+dx/dist*deflection*5;
      const ly=sy+dy/dist*deflection*5;
      cx.fillStyle='rgba(255,255,200,'+(0.1+0.1*Math.sin(t+i))+')';
      cx.beginPath();cx.arc(lx,ly,1+deflection*0.5,0,Math.PI*2);cx.fill();
    }
  }

  function drawInfoPanel(){
    const px=20,py=H-80,pw=200,ph=65;
    cx.fillStyle='rgba(0,0,0,0.5)';cx.fillRect(px,py,pw,ph);
    cx.fillStyle='rgba(255,200,100,0.5)';cx.font='8px monospace';cx.textAlign='left';
    const rs=(20*bhMass/10).toFixed(0);
    cx.fillText('Mass: '+bhMass+' M_sun',px+8,py+14);
    cx.fillText('Schwarzschild R: '+rs+' px',px+8,py+28);
    cx.fillText('Hawking Temp: '+(0.1/bhMass).toFixed(3)+' K',px+8,py+42);
    cx.fillText('Absorbed: '+(photons.filter(p=>p.absorbed).length||0),px+8,py+56);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,210,54);
    cx.strokeStyle='rgba(255,200,100,0.15)';cx.strokeRect(8,8,210,54);
    cx.font='10px monospace';cx.fillStyle='#f59e0b';cx.textAlign='left';
    cx.fillText('RADIO BLACK HOLE',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('EM Wave Absorption & Lensing',16,40);
    cx.fillText('Photons: '+photons.length+'  Hawking: '+hawkingParticles.length,16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(2,2,6,0.12)';cx.fillRect(0,0,W,H);

    if(Math.random()<0.1&&photons.length<MAX_PHOTONS)photons.push(new Photon());
    if(Math.random()<0.03)hawkingParticles.push(new HawkingParticle());

    drawGravitationalLensing();drawBlackHole();

    for(let i=photons.length-1;i>=0;i--){
      if(!photons[i].update())photons.splice(i,1);
      else photons[i].draw();
    }
    for(let i=hawkingParticles.length-1;i>=0;i--){
      if(!hawkingParticles[i].update())hawkingParticles.splice(i,1);
      else hawkingParticles[i].draw();
    }

    drawInfoPanel();drawHUD();

    cx.fillStyle='rgba(255,200,100,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Radio Black Hole — Gravitational Lensing & Hawking Radiation',8,H-8);

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
