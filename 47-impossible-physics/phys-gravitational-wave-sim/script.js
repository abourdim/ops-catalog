/**
 * Gravitational Wave Simulator — Workshop DIY v1.0
 * Spacetime distortion and LIGO detector simulation
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 50 Q30 20 50 50 Q70 80 90 50" fill="none" stroke="currentColor" stroke-width="2"><animate attributeName="d" values="M10 50 Q30 20 50 50 Q70 80 90 50;M10 50 Q30 80 50 50 Q70 20 90 50;M10 50 Q30 20 50 50 Q70 80 90 50" dur="1.5s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Gravitational Wave Sim',subtitle:'🌊 Gravitational Wave Sim — Spacetime ripples',disconnected:'Offline',connected:'Detecting',ready:'🌊 GW Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🌊 Detecting GW',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},fr:{title:'Sim Ondes Gravitationnelles',subtitle:'🌊 Sim OG — Ondulations de l\'espace-temps',disconnected:'Hors ligne',connected:'Détection',ready:'🌊 Simulateur OG prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🌊 Détection OG',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},ar:{title:'محاكي الموجات الثقالية',subtitle:'🌊 محاكي الموجات الثقالية — تموجات الزمكان',disconnected:'غير متصل',connected:'يكشف',ready:'🌊 محاكي الموجات جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🌊 كشف الموجات',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.'}};
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
