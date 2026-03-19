/**
 * Bell Inequality RF — Workshop DIY v1.0
 * Bell inequality test with entangled RF photon pairs
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="50" r="10" fill="currentColor" opacity=".5"><animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="70" cy="50" r="10" fill="currentColor" opacity=".5"><animate attributeName="r" values="12;8;12" dur="1.5s" repeatCount="indefinite"/></circle><line x1="30" y1="50" x2="70" y2="50" stroke="currentColor" stroke-width="1" stroke-dasharray="3,3" opacity=".4"/></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Bell Inequality RF',subtitle:'🔔 Bell Inequality RF — Entangled photon test',disconnected:'Offline',connected:'Testing',ready:'🔔 Bell Test ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'🔔 Bell test running',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Inégalité de Bell RF',subtitle:'🔔 Inégalité de Bell — Test photons intriqués',disconnected:'Hors ligne',connected:'Test',ready:'🔔 Test Bell prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'🔔 Test en cours',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'متباينة بيل RF',subtitle:'🔔 متباينة بيل RF — اختبار فوتونات متشابكة',disconnected:'غير متصل',connected:'يختبر',ready:'🔔 اختبار بيل جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'🔔 اختبار بيل يعمل',simStopped:'⏹ توقف',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
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
