/**
 * Bell Inequality RF — Workshop DIY v1.0
 * Bell inequality test with entangled RF photon pairs
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="50" r="10" fill="currentColor" opacity=".5"><animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="70" cy="50" r="10" fill="currentColor" opacity=".5"><animate attributeName="r" values="12;8;12" dur="1.5s" repeatCount="indefinite"/></circle><line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" stroke-width="1" stroke-dasharray="3,3" opacity=".4"/></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Bell Inequality RF',subtitle:'🔔 Bell Inequality RF — Entangled photon test',disconnected:'Offline',connected:'Testing',ready:'🔔 Bell Test ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🔔 Bell test running',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},fr:{title:'Inégalité de Bell RF',subtitle:'🔔 Inégalité de Bell — Test photons intriqués',disconnected:'Hors ligne',connected:'Test',ready:'🔔 Test Bell prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🔔 Test en cours',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},ar:{title:'متباينة بيل RF',subtitle:'🔔 متباينة بيل RF — اختبار فوتونات متشابكة',disconnected:'غير متصل',connected:'يختبر',ready:'🔔 اختبار بيل جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🔔 اختبار بيل يعمل',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.'}};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='bell-test-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0,coincidences=0;
const pairs=[];
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const aA=+$('angleASlider').value*Math.PI/180,aB=+$('angleBSlider').value*Math.PI/180,rate=+$('rateSlider').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,w,h);
  const srcX=w/2,srcY=h/2,detAX=80,detBX=w-80,detY=h/2;
  // Source
  ctx.fillStyle=accent;ctx.beginPath();ctx.arc(srcX,srcY,12+Math.sin(time*5)*3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='9px Orbitron';ctx.textAlign='center';ctx.fillText('SOURCE',srcX,srcY+25);
  // Detectors
  [{x:detAX,y:detY,a:aA,label:'A'},{x:detBX,y:detY,a:aB,label:'B'}].forEach(det=>{
    ctx.save();ctx.translate(det.x,det.y);ctx.rotate(det.a);
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(-20,-25,40,50);
    ctx.fillStyle='rgba(100,200,255,0.1)';ctx.fillRect(-20,-25,40,50);
    ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.moveTo(0,-25);ctx.lineTo(0,25);ctx.stroke();
    ctx.restore();
    ctx.fillStyle='rgba(100,200,255,0.6)';ctx.font='12px Orbitron';ctx.textAlign='center';
    ctx.fillText(det.label,det.x,det.y-35);ctx.fillText((det.a*180/Math.PI).toFixed(0)+'°',det.x,det.y+45);
  });
  ctx.textAlign='left';
  // Generate entangled pairs
  if(Math.random()<rate*0.01){
    const polAngle=Math.random()*Math.PI;
    pairs.push({x:srcX,y:srcY,dir:-1,pol:polAngle,age:0});
    pairs.push({x:srcX,y:srcY,dir:1,pol:polAngle+Math.PI/2,age:0});
  }
  // Animate pairs
  for(let i=pairs.length-1;i>=0;i--){
    const p=pairs[i];p.x+=p.dir*4;p.age++;
    if(p.x<detAX+20&&p.dir<0){
      const detect=Math.cos(p.pol-aA)**2>Math.random();
      if(detect)coincidences++;
      pairs.splice(i,1);continue;
    }
    if(p.x>detBX-20&&p.dir>0){
      const detect=Math.cos(p.pol-aB)**2>Math.random();
      if(detect)coincidences++;
      pairs.splice(i,1);continue;
    }
    if(p.age>300){pairs.splice(i,1);continue;}
    const alpha=Math.max(0,1-p.age/300);
    ctx.fillStyle=p.dir<0?`rgba(255,100,100,${alpha})`:`rgba(100,100,255,${alpha})`;
    ctx.beginPath();ctx.arc(p.x,p.y+(Math.sin(p.age*0.2)*5),3,0,Math.PI*2);ctx.fill();
    // Entanglement line
    if(p.dir<0&&i+1<pairs.length&&pairs[i+1]?.dir>0){
      ctx.strokeStyle=`rgba(200,100,255,${alpha*0.15})`;ctx.lineWidth=0.5;ctx.setLineDash([2,4]);
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(pairs[i+1].x,pairs[i+1].y);ctx.stroke();ctx.setLineDash([]);
    }
  }
  // CHSH calculation (quantum prediction: 2√2 ≈ 2.828)
  const diff=aA-aB;
  const E_ab=-Math.cos(2*diff);const E_ab2=-Math.cos(2*(diff+Math.PI/4));
  const E_a2b=-Math.cos(2*(diff-Math.PI/4));const E_a2b2=-Math.cos(2*diff);
  const S=Math.abs(E_ab-E_ab2+E_a2b+E_a2b2);
  const violation=S>2;
  // Correlation plot
  const plotX=w*0.15,plotY=h*0.05,plotW=w*0.2,plotH=h*0.3;
  ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.strokeRect(plotX,plotY,plotW,plotH);
  ctx.strokeStyle='rgba(255,100,100,0.3)';ctx.beginPath();ctx.moveTo(plotX,plotY+plotH/2-2/3*plotH/2);ctx.lineTo(plotX+plotW,plotY+plotH/2-2/3*plotH/2);ctx.stroke();
  ctx.fillStyle='rgba(255,100,100,0.3)';ctx.font='8px Orbitron';ctx.fillText('S=2 (classical limit)',plotX+2,plotY+plotH/2-2/3*plotH/2-3);
  // S value bar
  const barH=(S/4)*plotH;
  ctx.fillStyle=violation?'rgba(255,50,50,0.6)':'rgba(100,255,100,0.6)';
  ctx.fillRect(plotX+plotW*0.3,plotY+plotH-barH,plotW*0.4,barH);
  ctx.fillStyle='#fff';ctx.font='10px Orbitron';ctx.fillText('S='+S.toFixed(3),plotX+plotW*0.2,plotY+plotH+15);

  $('chshVal').textContent='S = '+S.toFixed(4);
  $('coincVal').textContent=coincidences.toLocaleString();
  $('violVal').textContent=violation?'YES — Quantum! (S > 2)':'No — Classical (S ≤ 2)';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('BELL TEST — S='+S.toFixed(3)+(violation?' VIOLATION!':''),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();coincidences=0;pairs.length=0;$('angleASlider').value=0;$('angleAVal').textContent='0°';$('angleBSlider').value=45;$('angleBVal').textContent='45°';$('rateSlider').value=50;$('rateVal').textContent='50/s';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('chshVal').textContent='--';$('coincVal').textContent='0';$('violVal').textContent='--';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;$('angleASlider').oninput=function(){$('angleAVal').textContent=this.value+'°';};$('angleBSlider').oninput=function(){$('angleBVal').textContent=this.value+'°';};$('rateSlider').oninput=function(){$('rateVal').textContent=this.value+'/s';};log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Bell Inequality RF
   Animated entangled photon pairs with detector angles,
   correlation curves, and CHSH inequality visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simBellInequality';let cv,cx,W,H,af=null,t=0;
  const photonPairs=[];const correlationData=[];
  let totalPairs=0,coincidences=0,angleA=0,angleB=45,chshValue=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060812;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  class PhotonPair{
    constructor(){
      this.x=W/2;this.y=H/2-20;
      this.angle=Math.random()*Math.PI;
      this.leftX=this.x;this.rightX=this.x;
      this.speed=3+Math.random()*2;
      this.age=0;this.maxAge=80;
      this.leftResult=null;this.rightResult=null;
      this.measured=false;
    }
    update(){
      this.age++;
      this.leftX-=this.speed;this.rightX+=this.speed;
      if(!this.measured&&this.leftX<120){
        const probA=Math.cos((this.angle-angleA*Math.PI/180))**2;
        this.leftResult=Math.random()<probA?1:-1;
        const probB=Math.cos((this.angle-angleB*Math.PI/180))**2;
        this.rightResult=Math.random()<probB?1:-1;
        this.measured=true;
        if(this.leftResult===this.rightResult)coincidences++;
        totalPairs++;
      }
      return this.age<this.maxAge;
    }
    draw(){
      const alpha=1-this.age/this.maxAge;
      // Left photon
      cx.fillStyle='rgba(59,130,246,'+(alpha*0.7)+')';
      cx.beginPath();cx.arc(this.leftX,this.y,3,0,Math.PI*2);cx.fill();
      // Right photon
      cx.fillStyle='rgba(239,68,68,'+(alpha*0.7)+')';
      cx.beginPath();cx.arc(this.rightX,this.y,3,0,Math.PI*2);cx.fill();
      // Entanglement line
      if(this.leftX>120&&this.rightX<W-120){
        cx.strokeStyle='rgba(200,100,255,'+(alpha*0.1)+')';cx.lineWidth=0.5;cx.setLineDash([2,4]);
        cx.beginPath();cx.moveTo(this.leftX,this.y);cx.lineTo(this.rightX,this.y);cx.stroke();
        cx.setLineDash([]);
      }
      // Measurement results
      if(this.measured){
        cx.fillStyle=this.leftResult>0?'rgba(0,255,0,'+alpha*0.5+')':'rgba(255,0,0,'+alpha*0.5+')';
        cx.font='10px monospace';cx.textAlign='center';
        cx.fillText(this.leftResult>0?'+':'-',this.leftX,this.y-10);
        cx.fillStyle=this.rightResult>0?'rgba(0,255,0,'+alpha*0.5+')':'rgba(255,0,0,'+alpha*0.5+')';
        cx.fillText(this.rightResult>0?'+':'-',this.rightX,this.y-10);
      }
    }
  }

  function drawSource(){
    const sx=W/2,sy=H/2-20;
    cx.save();cx.shadowColor='#8b5cf6';cx.shadowBlur=8+Math.sin(t*3)*4;
    cx.fillStyle='rgba(139,92,246,0.3)';cx.beginPath();cx.arc(sx,sy,12,0,Math.PI*2);cx.fill();
    cx.strokeStyle='#8b5cf6';cx.lineWidth=2;cx.beginPath();cx.arc(sx,sy,12,0,Math.PI*2);cx.stroke();
    cx.restore();
    cx.fillStyle='rgba(200,150,255,0.5)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText('ENTANGLED SOURCE',sx,sy+22);
  }

  function drawDetector(x,y,angle,label,color){
    cx.save();cx.translate(x,y);
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(-25,-30,50,60);
    cx.strokeStyle=color;cx.lineWidth=1.5;cx.strokeRect(-25,-30,50,60);
    // Polarizer angle
    cx.rotate(angle*Math.PI/180);
    cx.strokeStyle=color;cx.lineWidth=2;
    cx.beginPath();cx.moveTo(-15,0);cx.lineTo(15,0);cx.stroke();
    cx.restore();
    cx.fillStyle=color;cx.font='8px monospace';cx.textAlign='center';
    cx.fillText(label,x,y+42);
    cx.fillText(angle+'deg',x,y+52);
  }

  function drawCorrelationCurve(){
    const gx=20,gy=H-110,gw=300,gh=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(gx,gy,gw,gh);
    cx.strokeStyle='rgba(255,255,255,0.05)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(gx,gy+gh/2);cx.lineTo(gx+gw,gy+gh/2);cx.stroke();
    // QM prediction: -cos(a-b)
    cx.strokeStyle='rgba(139,92,246,0.6)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<gw;i++){
      const theta=i/gw*360;
      const corr=-Math.cos(theta*Math.PI/180);
      const y=gy+gh/2-corr*gh*0.4;
      if(i===0)cx.moveTo(gx+i,y);else cx.lineTo(gx+i,y);
    }
    cx.stroke();
    // Classical bound
    cx.strokeStyle='rgba(255,200,0,0.3)';cx.lineWidth=1;cx.setLineDash([4,4]);
    cx.beginPath();cx.moveTo(gx,gy+gh/2-gh*0.28);cx.lineTo(gx+gw,gy+gh/2-gh*0.28);cx.stroke();
    cx.beginPath();cx.moveTo(gx,gy+gh/2+gh*0.28);cx.lineTo(gx+gw,gy+gh/2+gh*0.28);cx.stroke();
    cx.setLineDash([]);
    // Current angle marker
    const diff=Math.abs(angleA-angleB);
    const markerX=gx+(diff/360)*gw;
    cx.strokeStyle='rgba(255,255,255,0.5)';cx.lineWidth=1;
    cx.beginPath();cx.moveTo(markerX,gy);cx.lineTo(markerX,gy+gh);cx.stroke();
    cx.fillStyle='rgba(139,92,246,0.5)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('CORRELATION E(a,b) vs angle diff',gx+8,gy-4);
    cx.fillText('Purple: QM  Yellow: Classical bound',gx+8,gy+gh+10);
  }

  function drawCHSHPanel(){
    const px=340,py=H-110,pw=200,ph=80;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(px,py,pw,ph);
    // Calculate CHSH
    const diff=(angleA-angleB)*Math.PI/180;
    chshValue=2*Math.sqrt(2)*Math.abs(Math.cos(diff));
    const violated=chshValue>2;
    cx.fillStyle=violated?'rgba(239,68,68,0.5)':'rgba(34,197,94,0.5)';
    cx.font='9px monospace';cx.textAlign='left';
    cx.fillText('CHSH INEQUALITY TEST',px+8,py+14);
    cx.fillStyle='#aaa';cx.font='8px monospace';
    cx.fillText('S = '+chshValue.toFixed(3),px+8,py+30);
    cx.fillText('Classical bound: S <= 2',px+8,py+44);
    cx.fillText('QM max: S = 2*sqrt(2) = 2.828',px+8,py+58);
    cx.fillStyle=violated?'#ef4444':'#22c55e';
    cx.fillText(violated?'BELL VIOLATION!':'Within classical bound',px+8,py+72);
    // Bar
    const barW=pw-16;const barX=px+8;const barY=py+ph-12;
    cx.fillStyle='rgba(255,255,255,0.1)';cx.fillRect(barX,barY,barW,8);
    const sNorm=Math.min(1,chshValue/3);
    cx.fillStyle=violated?'#ef4444':'#22c55e';
    cx.fillRect(barX,barY,barW*sNorm,8);
    // Classical limit line
    cx.strokeStyle='#f59e0b';cx.lineWidth=2;
    cx.beginPath();cx.moveTo(barX+barW*(2/3),barY);cx.lineTo(barX+barW*(2/3),barY+8);cx.stroke();
  }

  function drawStats(){
    const sx=560,sy=H-110,sw=200,sh=80;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(sx,sy,sw,sh);
    cx.fillStyle='rgba(100,200,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('STATISTICS',sx+8,sy+14);
    cx.fillStyle='#aaa';
    const corrRate=totalPairs>0?(coincidences/totalPairs*100).toFixed(1):'--';
    cx.fillText('Total Pairs: '+totalPairs,sx+8,sy+30);
    cx.fillText('Coincidences: '+coincidences,sx+8,sy+44);
    cx.fillText('Correlation: '+corrRate+'%',sx+8,sy+58);
    cx.fillText('Angle A-B: '+(angleA-angleB)+'deg',sx+8,sy+72);
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,18,0.1)';cx.fillRect(0,0,W,H);

    // Slowly sweep angles
    angleA=Math.floor(Math.sin(t*0.15)*45+45);
    angleB=Math.floor(Math.cos(t*0.1)*45+45);

    if(Math.random()<0.12)photonPairs.push(new PhotonPair());
    for(let i=photonPairs.length-1;i>=0;i--){
      if(!photonPairs[i].update())photonPairs.splice(i,1);
      else photonPairs[i].draw();
    }

    drawSource();
    drawDetector(100,H/2-20,angleA,'DETECTOR A','rgba(59,130,246,0.7)');
    drawDetector(W-100,H/2-20,angleB,'DETECTOR B','rgba(239,68,68,0.7)');
    drawCorrelationCurve();drawCHSHPanel();drawStats();

    cx.fillStyle='rgba(139,92,246,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Bell Inequality RF — Entangled Photon Pair Correlation Test',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
