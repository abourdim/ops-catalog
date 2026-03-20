/**
 * Casimir Effect Detector — Workshop DIY v1.0
 * Vacuum force measurement between conducting plates
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="10" width="4" height="80" fill="currentColor" opacity=".6"/><rect x="66" y="10" width="4" height="80" fill="currentColor" opacity=".6"><animate attributeName="x" values="66;50;66" dur="3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Casimir Effect Detector',subtitle:'⚡ Casimir Detector — Vacuum force measurement',disconnected:'Offline',connected:'Measuring',ready:'⚡ Casimir Detector ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'⚡ Measuring Casimir force',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code'},fr:{title:'Détecteur Effet Casimir',subtitle:'⚡ Détecteur Casimir — Mesure de force du vide',disconnected:'Hors ligne',connected:'Mesure',ready:'⚡ Détecteur Casimir prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'⚡ Mesure en cours',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil'},ar:{title:'كاشف تأثير كازيمير',subtitle:'⚡ كاشف كازيمير — قياس قوة الفراغ',disconnected:'غير متصل',connected:'يقيس',ready:'⚡ كاشف كازيمير جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'⚡ قياس قوة كازيمير',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز'}};
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
