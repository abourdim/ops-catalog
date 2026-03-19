/**
 * Superluminal Illusion Lab — Workshop DIY v1.0
 * Apparent faster-than-light group velocity demonstrations
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="50" r="8" fill="currentColor" opacity=".6"><animate attributeName="cx" values="20;80;20" dur="0.8s" repeatCount="indefinite"/></circle><line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="1" stroke-dasharray="4,4" opacity=".3"/></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.2);o.start(n);o.stop(n+.2);}
const LANG={
  en:{title:'Superluminal Illusion Lab',subtitle:'💫 Superluminal Illusion — Apparent FTL effects',disconnected:'Offline',connected:'Active',mainSection:'Superluminal Illusion Lab',mainDesc:'Demonstrate apparent faster-than-light group velocity illusions',sectionA:'Velocity Analysis',sectionC:'Theory',activityLog:'Activity Log',clear:'Clear',copy:'Copy',export:'Export',settings:'⚙️ Settings',language:'Language',theme:'Theme',help:'❓ Help',ready:'💫 Superluminal Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',illusionType:'Illusion Type',speedFactor:'Speed Factor (×c)',mediumDensity:'Medium Density',theoryIntro:'Superluminal illusions arise from group velocity exceeding c without FTL information transfer.',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'💫 Illusion active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Labo Illusion Superluminique',subtitle:'💫 Illusion Superluminique — Effets apparents FTL',disconnected:'Hors ligne',connected:'Actif',mainSection:'Labo Illusion Superluminique',mainDesc:'Démontrer les illusions de vitesse de groupe superluminique',sectionA:'Analyse de Vitesse',sectionC:'Théorie',activityLog:'Journal',clear:'Effacer',copy:'Copier',export:'Exporter',settings:'⚙️ Paramètres',language:'Langue',theme:'Thème',help:'❓ Aide',ready:'💫 Labo prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',illusionType:'Type d\'Illusion',speedFactor:'Facteur (×c)',mediumDensity:'Densité du Milieu',theoryIntro:'Les illusions superluminiques viennent d\'une vitesse de groupe > c sans transfert FTL d\'information.',splashHint:'appuyer pour passer',langChanged:'🌐 Français',themeChanged:'🎨 Thème →',simStarted:'💫 Illusion active',simStopped:'⏹ Arrêté',simReset:'↺ Réinitialisé',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'مختبر وهم فوق الضوء',subtitle:'💫 وهم فوق الضوء — تأثيرات FTL ظاهرية',disconnected:'غير متصل',connected:'نشط',mainSection:'مختبر وهم فوق الضوء',mainDesc:'عرض أوهام سرعة المجموعة الظاهرية فوق الضوء',sectionA:'تحليل السرعة',sectionC:'النظرية',activityLog:'سجل النشاط',clear:'مسح',copy:'نسخ',export:'تصدير',settings:'⚙️ الإعدادات',language:'اللغة',theme:'المظهر',help:'❓ مساعدة',ready:'💫 المختبر جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',illusionType:'نوع الوهم',speedFactor:'عامل السرعة (×c)',mediumDensity:'كثافة الوسط',theoryIntro:'أوهام فوق الضوء تنشأ من سرعة المجموعة التي تتجاوز c بدون نقل معلومات أسرع من الضوء.',splashHint:'انقر للتخطي',langChanged:'🌐 العربية',themeChanged:'🎨 المظهر ←',simStarted:'💫 الوهم نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='superluminal-log.txt';a.click();}
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

/* ═══════ SUPERLUMINAL SIMULATION ═══════ */
let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const iType=$('typeSelect').value,speed=+$('speedSlider').value/100,density=+$('densitySlider').value/100;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const mid=h/2;

  if(iType==='group'){
    // Envelope moving faster than carrier waves
    const envSpeed=speed*3,carrierSpeed=1;
    for(let x=0;x<w;x+=2){
      const env=Math.exp(-Math.pow((x-((time*envSpeed*100)%w))/80,2));
      const carrier=Math.sin(x*0.1-time*carrierSpeed*5);
      const y=mid+carrier*env*60;
      ctx.fillStyle=`rgba(100,200,255,${env*0.8})`;ctx.fillRect(x,y,2,2);
    }
    // Envelope marker
    const envPos=(time*envSpeed*100)%w;
    ctx.fillStyle=accent;ctx.beginPath();ctx.moveTo(envPos,mid-80);ctx.lineTo(envPos-5,mid-90);ctx.lineTo(envPos+5,mid-90);ctx.fill();
    ctx.fillStyle=accent;ctx.font='10px Orbitron';ctx.fillText('GROUP: '+speed.toFixed(1)+'c',envPos-20,mid-95);
    // Signal velocity marker (always ≤c)
    const sigPos=(time*100)%w;
    ctx.fillStyle='rgba(100,255,100,0.6)';ctx.beginPath();ctx.arc(sigPos,mid+100,4,0,Math.PI*2);ctx.fill();
    ctx.fillText('SIGNAL: ≤1.0c',sigPos-20,mid+120);
  } else if(iType==='scissor'){
    // Two lines crossing - intersection moves FTL
    const angle=0.1/(speed+0.1);
    const y1=mid+Math.tan(angle)*(time*50%w-w/2)*1.5;
    const y2=mid-Math.tan(angle)*(time*50%w-w/2)*1.5;
    ctx.strokeStyle='rgba(100,200,255,0.5)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(0,mid-150);ctx.lineTo(w,y1+150);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,mid+150);ctx.lineTo(w,y2-150);ctx.stroke();
    // Intersection point
    const ix=w/2,iy=mid+Math.sin(time*speed*2)*100;
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(ix,iy,8+Math.sin(time*10)*3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='11px Orbitron';ctx.fillText('INTERSECTION: '+(speed*2).toFixed(1)+'c',ix+15,iy);
  } else if(iType==='phase'){
    // Phase fronts moving faster than group
    for(let i=0;i<20;i++){
      const phaseX=(time*speed*200+i*40)%w;
      ctx.strokeStyle=`rgba(100,200,255,${0.1+0.1*Math.sin(time+i)})`;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(phaseX,mid-80);ctx.lineTo(phaseX,mid+80);ctx.stroke();
    }
    // Group envelope
    const gx=(time*80)%w;
    ctx.fillStyle=accent+'40';
    ctx.beginPath();ctx.ellipse(gx,mid,60,40,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=accent;ctx.font='10px Orbitron';
    ctx.fillText('PHASE: '+speed.toFixed(1)+'c',10,30);ctx.fillText('GROUP: 1.0c',10,45);
  } else {
    // Quasar jet apparent motion
    const jetAngle=Math.asin(1/speed)*0.8;
    for(let i=0;i<50;i++){
      const t0=time*2-i*0.1;
      const realX=w*0.2+Math.cos(jetAngle)*t0*30;
      const realY=mid-Math.sin(jetAngle)*t0*30;
      const appX=w*0.2+t0*30*speed*Math.sin(jetAngle);
      if(realX>0&&realX<w&&realY>0&&realY<h){
        ctx.fillStyle=`rgba(100,150,255,${0.5-i*0.01})`;ctx.beginPath();ctx.arc(realX,realY,3,0,Math.PI*2);ctx.fill();
      }
      if(appX>0&&appX<w){
        ctx.fillStyle=`rgba(255,200,100,${0.5-i*0.01})`;ctx.beginPath();ctx.arc(appX,mid+50,3,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.fillStyle='rgba(100,150,255,0.6)';ctx.font='10px Orbitron';ctx.fillText('ACTUAL JET',w*0.2,mid-100);
    ctx.fillStyle='rgba(255,200,100,0.6)';ctx.fillText('APPARENT MOTION: '+speed.toFixed(1)+'c',w*0.2,mid+80);
  }
  // Speed of light reference
  ctx.strokeStyle='rgba(255,255,100,0.2)';ctx.setLineDash([2,4]);ctx.beginPath();
  const cPos=(time*100)%w;ctx.moveTo(cPos,0);ctx.lineTo(cPos,h);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,255,100,0.3)';ctx.font='9px Orbitron';ctx.fillText('c',cPos+3,12);

  $('phaseVelVal').textContent=(speed*1.2).toFixed(3)+' c';
  $('groupVelVal').textContent=speed.toFixed(3)+' c';
  $('sigVelVal').textContent=Math.min(speed,1).toFixed(3)+' c';
  $('infoVal').textContent='≤ 1.000 c (always)';

  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('SUPERLUMINAL ILLUSION — '+iType.toUpperCase(),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('speedSlider').value=150;$('speedVal').textContent='1.5c';$('densitySlider').value=50;$('densityVal').textContent='50%';$('typeSelect').value='group';
  $('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('phaseVelVal').textContent='-- c';$('groupVelVal').textContent='-- c';$('sigVelVal').textContent='-- c';$('infoVal').textContent='≤ 1.000 c';log(LANG[currentLang].simReset,'info');}
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
  $('speedSlider').oninput=function(){$('speedVal').textContent=(this.value/100).toFixed(1)+'c';};
  $('densitySlider').oninput=function(){$('densityVal').textContent=this.value+'%';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);
