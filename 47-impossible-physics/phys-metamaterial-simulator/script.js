/**
 * Metamaterial Simulator — Workshop DIY v1.0
 * Negative-index metamaterial and cloaking visualization
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="2" opacity=".4"><animate attributeName="rx" values="0;15;0" dur="3s" repeatCount="indefinite"/></rect><line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="1.5" opacity=".6"><animate attributeName="y1" values="50;35;50" dur="2s" repeatCount="indefinite"/><animate attributeName="y2" values="50;65;50" dur="2s" repeatCount="indefinite"/></line></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;o.frequency.value=t==='success'?523:t==='error'?200:800;if(t==='error')o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.2);o.start(n);o.stop(n+.2);}
const LANG={
  en:{title:'Metamaterial Simulator',subtitle:'🔬 Metamaterial Simulator — Negative refraction & cloaking',disconnected:'Offline',connected:'Simulating',mainSection:'Metamaterial Simulator',mainDesc:'Simulate negative-index metamaterials and electromagnetic cloaking',sectionA:'Material Properties',sectionC:'Metamaterial Theory',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What are metamaterials?',faq_a1:'Engineered structures with properties not found in nature.',faq_q2:'What is negative refraction?',faq_a2:'Light bends opposite to normal materials.',howto_1:'Choose a metamaterial type.',howto_2:'Adjust frequency and refractive index.',howto_3:'Press Start to see wave propagation.',working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🔬 Metamaterial Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',matType:'Material Type',freqLabel:'Frequency (GHz)',indexLabel:'Refractive Index',startSim:'▶ Start',stopSim:'⏹ Stop',resetSim:'↺ Reset',permittivity:'Permittivity (ε):',permeability:'Permeability (μ):',impedance:'Impedance (Z):',groupVel:'Group Velocity:',theoryIntro:'Metamaterials are engineered structures with unusual EM properties:',theory1:'Negative refractive index bends light the wrong way',theory2:'Split-ring resonators create artificial magnetic response',theory3:'Transformation optics enables EM cloaking',theory4:'Perfect lensing can beat the diffraction limit',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',simStarted:'▶ Simulation started',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Simulateur Métamatériaux',subtitle:'🔬 Simulateur — Réfraction négative & occultation',disconnected:'Hors ligne',connected:'Simulation',mainSection:'Simulateur Métamatériaux',mainDesc:'Simuler métamatériaux à indice négatif et occultation EM',sectionA:'Propriétés',sectionC:'Théorie',activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Thème',settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Que sont les métamatériaux?',faq_a1:'Structures avec propriétés inexistantes dans la nature.',faq_q2:'Réfraction négative?',faq_a2:'La lumière se courbe à l\'envers.',howto_1:'Choisissez un type.',howto_2:'Ajustez fréquence et indice.',howto_3:'Démarrez la propagation.',working:'En cours…',filterAll:'Tout',soundEffects:'Sons',ready:'🔬 Simulateur prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',matType:'Type',freqLabel:'Fréquence (GHz)',indexLabel:'Indice de Réfraction',startSim:'▶ Démarrer',stopSim:'⏹ Arrêter',resetSim:'↺ Réinit.',permittivity:'Permittivité (ε):',permeability:'Perméabilité (μ):',impedance:'Impédance (Z):',groupVel:'Vitesse Groupe:',theoryIntro:'Métamatériaux: structures aux propriétés EM inhabituelles:',theory1:'Indice négatif courbe la lumière à l\'envers',theory2:'Résonateurs à anneaux fendus',theory3:'Optique de transformation pour l\'occultation',theory4:'Lentille parfaite au-delà de la diffraction',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',simStarted:'▶ Démarrée',simStopped:'⏹ Arrêtée',simReset:'↺ Réinitialisée',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'محاكي المواد الخارقة',subtitle:'🔬 محاكي المواد الخارقة — انكسار سالب وإخفاء',disconnected:'غير متصل',connected:'يعمل',mainSection:'محاكي المواد الخارقة',mainDesc:'محاكاة مواد خارقة ذات معامل انكسار سالب وإخفاء كهرومغناطيسي',sectionA:'خصائص المادة',sectionC:'النظرية',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيفية',wiki:'ويكي',faq_q1:'ما هي المواد الخارقة؟',faq_a1:'هياكل بخصائص غير موجودة في الطبيعة.',faq_q2:'ما الانكسار السالب؟',faq_a2:'الضوء ينحني بالعكس.',howto_1:'اختر نوع المادة.',howto_2:'اضبط التردد والمعامل.',howto_3:'اضغط ابدأ.',working:'جارٍ…',filterAll:'الكل',soundEffects:'أصوات',ready:'🔬 المحاكي جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',matType:'النوع',freqLabel:'التردد (جيجاهرتز)',indexLabel:'معامل الانكسار',startSim:'▶ ابدأ',stopSim:'⏹ إيقاف',resetSim:'↺ إعادة',permittivity:'السماحية (ε):',permeability:'النفاذية (μ):',impedance:'المعاوقة (Z):',groupVel:'سرعة المجموعة:',theoryIntro:'المواد الخارقة هياكل بخصائص كهرومغناطيسية غير عادية:',theory1:'معامل انكسار سالب يحني الضوء بالعكس',theory2:'رنانات حلقية مشقوقة',theory3:'بصريات التحويل تمكّن الإخفاء',theory4:'عدسة مثالية تتجاوز حد الحيود',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',simStarted:'▶ بدأت المحاكاة',simStopped:'⏹ توقفت',simReset:'↺ إعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='metamaterial-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){$('logPanel')?.classList.add('open');document.body.classList.add('log-open');}function closeLog(){$('logPanel')?.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ METAMATERIAL SIM ═══════ */
let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('metaCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const matType=$('matType').value,freq=+$('freqSlider').value,nIdx=+$('indexSlider').value/100;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(0,0,w,h);
  const mid=w/2;
  ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(mid,0);ctx.lineTo(mid,h);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(150,200,255,0.5)';ctx.font='11px Orbitron,monospace';ctx.fillText('NORMAL (n=1.0)',10,20);ctx.fillText('META (n='+nIdx.toFixed(2)+')',mid+10,20);
  if(matType==='cloak'){
    const cx2=w*0.65,cy2=h/2,ro=80,ri=40;
    ctx.fillStyle='rgba(255,50,50,0.3)';ctx.beginPath();ctx.arc(cx2,cy2,ri,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx2,cy2,ro,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<20;i++){const yOff=(i-10)*18,y0=cy2+yOff;ctx.strokeStyle=`rgba(100,200,255,${0.3+0.1*Math.sin(time*2+i)})`;ctx.lineWidth=1;ctx.beginPath();
      for(let x=0;x<w;x+=2){const dx=x-cx2,dy=y0-cy2,dist=Math.sqrt(dx*dx+dy*dy);let yy=y0+Math.sin(x*0.02*freq/10-time*3)*5;if(dist<ro+20&&dist>ri&&x>cx2-ro-20&&x<cx2+ro+20)yy+=(1-Math.abs(dist-((ro+ri)/2))/(ro-ri)*2)*15*Math.sign(yOff);x===0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();}
  } else {
    const angle=Math.PI/6;
    for(let i=0;i<15;i++){const phase=time*3-i*0.5,startY=h*0.2+i*20;
      ctx.strokeStyle=`rgba(100,200,255,${0.2+0.15*Math.sin(phase)})`;ctx.lineWidth=1.5;ctx.beginPath();
      for(let x=0;x<mid;x+=2){const y=startY+Math.sin(x*0.015*freq/10-phase)*8+(x/mid)*Math.tan(angle)*80;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
      const refAngle=nIdx<0?-angle*Math.abs(nIdx):angle*nIdx;ctx.strokeStyle=accent.replace(')',`,${0.2+0.15*Math.sin(phase)})`).replace('rgb','rgba');ctx.beginPath();
      for(let x=mid;x<w;x+=2){const dx=x-mid;const y=startY+Math.tan(angle)*80+Math.sin(dx*0.015*freq/10*Math.abs(nIdx)-phase*nIdx)*8+dx/mid*Math.tan(refAngle)*80;dx===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();
    }
    if(matType==='srr'){for(let gx=mid+30;gx<w-30;gx+=50)for(let gy=30;gy<h-30;gy+=50){ctx.strokeStyle=`rgba(255,200,100,${0.2+0.1*Math.sin(time*4+gx*.01)})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(gx,gy,12,0.2,Math.PI*2-0.2);ctx.stroke();ctx.beginPath();ctx.arc(gx,gy,8,Math.PI+0.2,Math.PI*3-0.2);ctx.stroke();}}
    if(matType==='photonic'){for(let gx=mid+25;gx<w-20;gx+=35)for(let gy=20;gy<h-20;gy+=35){const r=8+2*Math.sin(time*2+gx*.05+gy*.05);ctx.fillStyle=`rgba(100,150,255,${0.1+0.05*Math.sin(time*3+gx)})`;ctx.beginPath();ctx.arc(gx,gy,r,0,Math.PI*2);ctx.fill();}}
  }
  const eps=nIdx<0?nIdx:-nIdx*0.8,mu=nIdx/(eps||1);
  $('epsVal').textContent=eps.toFixed(3);$('muVal').textContent=mu.toFixed(3);
  $('zVal').textContent=(377*Math.sqrt(Math.abs(mu/(eps||1)))).toFixed(1)+' Ω';$('vgVal').textContent=(1/Math.abs(nIdx+.001)).toFixed(3)+' c';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('METAMATERIAL — '+matType.toUpperCase()+' @ '+freq+' GHz',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('freqSlider').value=30;$('freqVal').textContent='30 GHz';$('indexSlider').value=-100;$('indexVal').textContent='-1.00';$('matType').value='nri';
  $('metaCanvas')?.getContext('2d').clearRect(0,0,800,350);$('epsVal').textContent='--';$('muVal').textContent='--';$('zVal').textContent='-- Ω';$('vgVal').textContent='-- c';log(LANG[currentLang].simReset,'info');}
function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}};}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  $('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;
  $('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' GHz';};$('indexSlider').oninput=function(){$('indexVal').textContent=(this.value/100).toFixed(2);};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);
