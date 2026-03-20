/**
 * Sagnac Interferometer — Workshop DIY v1.0
 * Rotation sensing with counter-propagating beams
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="2" opacity=".4"/><circle cx="50" cy="15" r="4" fill="currentColor"><animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="3s" repeatCount="indefinite"/></circle><circle cx="50" cy="15" r="4" fill="currentColor" opacity=".5"><animateTransform attributeName="transform" type="rotate" values="360 50 50;0 50 50" dur="3s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Sagnac Interferometer',subtitle:'🔄 Sagnac Interferometer — Rotation detection',disconnected:'Offline',connected:'Sensing',ready:'🔄 Sagnac Interferometer ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🔄 Sensing rotation',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},fr:{title:'Interféromètre Sagnac',subtitle:'🔄 Interféromètre Sagnac — Détection de rotation',disconnected:'Hors ligne',connected:'Détecte',ready:'🔄 Interféromètre prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🔄 Détection de rotation',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},ar:{title:'مقياس تداخل ساناك',subtitle:'🔄 مقياس تداخل ساناك — كشف الدوران',disconnected:'غير متصل',connected:'يستشعر',ready:'🔄 مقياس ساناك جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🔄 استشعار الدوران',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.'}};
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
