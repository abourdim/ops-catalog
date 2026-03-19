/**
 * SDR IQ Explorer — Workshop DIY v1.0
 * Visualize I/Q data — Lissajous, phase plane, magnitude, instantaneous frequency
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="40" ry="40" stroke="currentColor" fill="none" stroke-width="2" opacity=".3"/><circle cx="50" cy="50" r="5" fill="currentColor"><animateMotion dur="2s" repeatCount="indefinite"><mpath href="#iqpath"/></animateMotion></circle><path id="iqpath" d="M90 50 A40 40 0 1 1 89.99 50" fill="none" stroke="none"/><line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" opacity=".2" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" opacity=".2" stroke-width="1"/><text x="92" y="54" fill="currentColor" font-size="10">I</text><text x="52" y="14" fill="currentColor" font-size="10">Q</text></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

const LANG={
en:{title:'SDR IQ Explorer',subtitle:'🔄 IQ Explorer — Visualize complex signals',disconnected:'Disconnected',connected:'Connected',mainSection:'IQ Explorer',mainDesc:'Lissajous, phase plane, magnitude and frequency',sectionA:'IQ Statistics',sectionB:'IQ Correction',sectionC:'IQ Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is IQ Explorer?',faq_a1:'A tool for visualizing complex I/Q signals with Lissajous patterns.',faq_q2:'What is I/Q data?',faq_a2:'Two orthogonal components representing complex baseband signals.',faq_q3:'What is IQ imbalance?',faq_a3:'Gain or phase mismatch causing image frequency leakage.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
howto_1:'Select an IQ signal mode.',howto_2:'Adjust frequency and imbalance.',howto_3:'Watch Lissajous and time displays.',howto_4:'Try auto-correction for IQ imbalance.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🔄 IQ Explorer ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
iqMode:'IQ Signal Mode',freqLabel:'Frequency (Hz)',gainImb:'Gain Imbalance (dB)',phaseImb:'Phase Imbalance (deg)',startIQ:'▶ Start',stopIQ:'⏹ Stop',
iqCorr:'IQ Correlation:',imgRej:'Image Rejection:',instFreq:'Inst. Frequency:',
corrDesc:'Auto IQ imbalance correction compensates gain and phase offset in real-time.',applyCorr:'Apply Auto-Correction',
theoryIntro:'I/Q representation is fundamental to SDR:',theory1:'Complex signal: s(t) = I(t) + jQ(t)',theory2:'Magnitude: |s| = sqrt(I² + Q²)',theory3:'Phase: φ = atan2(Q, I)',theory4:'IQ imbalance causes image frequency leakage',theory5:'Lissajous pattern reveals phase relationships',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',iqStarted:'▶ IQ running',iqStopped:'⏹ Stopped',corrApplied:'Auto-correction applied',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Explorateur IQ SDR',subtitle:'🔄 Explorateur IQ — Visualisez les signaux complexes',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Explorateur IQ',mainDesc:'Lissajous, plan de phase, magnitude et frequence',sectionA:'Statistiques IQ',sectionB:'Correction IQ',sectionC:'Theorie IQ',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce que l\'Explorateur IQ?',faq_a1:'Un outil pour visualiser les signaux I/Q complexes.',faq_q2:'Qu\'est-ce que les donnees I/Q?',faq_a2:'Deux composantes orthogonales representant les signaux complexes.',faq_q3:'Qu\'est-ce que le desequilibre IQ?',faq_a3:'Un decalage de gain ou phase causant une fuite d\'image.',faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout est local.',
howto_1:'Selectionnez un mode IQ.',howto_2:'Ajustez frequence et desequilibre.',howto_3:'Observez les affichages Lissajous et temporel.',howto_4:'Essayez l\'auto-correction IQ.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🔄 Explorateur IQ pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
iqMode:'Mode Signal IQ',freqLabel:'Frequence (Hz)',gainImb:'Desequilibre Gain (dB)',phaseImb:'Desequilibre Phase (deg)',startIQ:'▶ Demarrer',stopIQ:'⏹ Arreter',
iqCorr:'Correlation IQ:',imgRej:'Rejet Image:',instFreq:'Freq. Inst.:',
corrDesc:'La correction automatique compense le desequilibre IQ.',applyCorr:'Appliquer Auto-Correction',
theoryIntro:'La representation I/Q est fondamentale au SDR:',theory1:'Signal complexe: s(t) = I(t) + jQ(t)',theory2:'Magnitude: |s| = sqrt(I² + Q²)',theory3:'Phase: φ = atan2(Q, I)',theory4:'Le desequilibre IQ cause une fuite d\'image',theory5:'Les figures de Lissajous revelent les relations de phase',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',iqStarted:'▶ IQ en cours',iqStopped:'⏹ Arrete',corrApplied:'Auto-correction appliquee',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'مستكشف IQ للراديو البرمجي',subtitle:'🔄 مستكشف IQ — تصور الاشارات المركبة',disconnected:'غير متصل',connected:'متصل',mainSection:'مستكشف IQ',mainDesc:'ليساجو، مستوى الطور، السعة والتردد',sectionA:'احصائيات IQ',sectionB:'تصحيح IQ',sectionC:'نظرية IQ',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
faq_q1:'ما هو مستكشف IQ؟',faq_a1:'اداة لتصور اشارات I/Q المركبة مع انماط ليساجو.',faq_q2:'ما هي بيانات I/Q؟',faq_a2:'مكونان متعامدان يمثلان الاشارات المركبة.',faq_q3:'ما هو اختلال IQ؟',faq_a3:'عدم تطابق الكسب او الطور يسبب تسرب تردد الصورة.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',
howto_1:'اختر وضع اشارة IQ.',howto_2:'اضبط التردد والاختلال.',howto_3:'شاهد عروض ليساجو والمجال الزمني.',howto_4:'جرب التصحيح التلقائي لاختلال IQ.',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🔄 مستكشف IQ جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
iqMode:'وضع اشارة IQ',freqLabel:'التردد (هرتز)',gainImb:'اختلال الكسب (ديسيبل)',phaseImb:'اختلال الطور (درجة)',startIQ:'▶ ابدا',stopIQ:'⏹ ايقاف',
iqCorr:'ارتباط IQ:',imgRej:'رفض الصورة:',instFreq:'التردد اللحظي:',
corrDesc:'التصحيح التلقائي يعوض اختلال الكسب والطور.',applyCorr:'تطبيق التصحيح التلقائي',
theoryIntro:'تمثيل I/Q اساسي في SDR:',theory1:'اشارة مركبة: s(t) = I(t) + jQ(t)',theory2:'السعة: |s| = sqrt(I² + Q²)',theory3:'الطور: φ = atan2(Q, I)',theory4:'اختلال IQ يسبب تسرب تردد الصورة',theory5:'انماط ليساجو تكشف علاقات الطور',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',iqStarted:'▶ IQ يعمل',iqStopped:'⏹ متوقف',corrApplied:'تم تطبيق التصحيح التلقائي',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='iq-explorer-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),conts=document.querySelectorAll('.help-content');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));conts.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');}));}

/* ═══════ IQ SIMULATION ═══════ */
let running=false,animFrame=null;
const SR=8192,N=1024;
let corrGain=1,corrPhase=0,autoCorr=false;
let tOff=0;

function generateIQ(mode,freq,gainImb,phaseImb){
  const I=new Float32Array(N),Q=new Float32Array(N);
  const dt=1/SR;
  const gLin=Math.pow(10,gainImb/20);
  const phRad=phaseImb*Math.PI/180;
  for(let i=0;i<N;i++){
    const t=(tOff+i)*dt;
    let ii=0,qq=0;
    switch(mode){
      case 'cw':ii=Math.cos(2*Math.PI*freq*t);qq=Math.sin(2*Math.PI*freq*t);break;
      case 'dual':ii=Math.cos(2*Math.PI*freq*t)+.5*Math.cos(2*Math.PI*freq*2.7*t);qq=Math.sin(2*Math.PI*freq*t)+.5*Math.sin(2*Math.PI*freq*2.7*t);break;
      case 'sweep':{const f=freq*.5+freq*1.5*(i/N);ii=Math.cos(2*Math.PI*f*t);qq=Math.sin(2*Math.PI*f*t);break;}
      case 'chirp':{const f=freq+freq*3*t;ii=Math.cos(2*Math.PI*f*t);qq=Math.sin(2*Math.PI*f*t);break;}
      case 'qpsk':{const sym=Math.floor(i/64)%4;const angle=[Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4][sym];ii=Math.cos(angle+2*Math.PI*freq*t);qq=Math.sin(angle+2*Math.PI*freq*t);break;}
      case 'noise':ii=(Math.random()-.5)*2;qq=(Math.random()-.5)*2;break;
      case 'imbalance':ii=Math.cos(2*Math.PI*freq*t);qq=Math.sin(2*Math.PI*freq*t);break;
    }
    // Apply imbalance
    I[i]=ii;
    Q[i]=qq*gLin*Math.cos(phRad)+ii*gLin*Math.sin(phRad);
    // Add small noise
    I[i]+=(Math.random()-.5)*.02;Q[i]+=(Math.random()-.5)*.02;
    // Apply correction if enabled
    if(autoCorr){Q[i]=Q[i]/corrGain-I[i]*Math.tan(corrPhase);}
  }
  tOff+=N;
  return {I,Q};
}

function drawIQPlane(I,Q){
  const c=$('iqCanvas');if(!c)return;const ctx=c.getContext('2d'),s=c.width,cx=s/2,cy=s/2,r=s/2-10;
  ctx.fillStyle='rgba(10,10,26,0.3)';ctx.fillRect(0,0,s,s);
  ctx.strokeStyle='#223';ctx.lineWidth=.5;
  ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(s,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,s);ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,r*.7,0,2*Math.PI);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle=accent;
  for(let i=0;i<I.length;i+=2){
    const px=cx+I[i]*r*.8,py=cy-Q[i]*r*.8;
    ctx.globalAlpha=.4;ctx.beginPath();ctx.arc(px,py,1.5,0,2*Math.PI);ctx.fill();
  }
  ctx.globalAlpha=1;ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';
  ctx.fillText('I',s-14,cy-4);ctx.fillText('Q',cx+4,12);
}

function drawTimeIQ(I,Q){
  const c=$('timeIQCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,h/4);ctx.lineTo(w,h/4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,3*h/4);ctx.lineTo(w,3*h/4);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const show=Math.min(512,I.length);
  // I channel
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<show;i++){const x=i/show*w,y=h/4-I[i]*h*.2;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  // Q channel
  ctx.strokeStyle='#4af';ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<show;i++){const x=i/show*w,y=3*h/4-Q[i]*h*.2;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('I channel',4,12);
  ctx.fillStyle='#4af';ctx.fillText('Q channel',4,h/2+12);
}

function drawPhase(I,Q){
  const c=$('phaseCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  ctx.strokeStyle='#f84';ctx.lineWidth=1.5;ctx.beginPath();
  const show=Math.min(512,I.length);
  for(let i=0;i<show;i++){
    const ph=Math.atan2(Q[i],I[i]);
    const x=i/show*w,y=h/2-ph/(Math.PI)*h*.45;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }ctx.stroke();
  // Magnitude
  ctx.strokeStyle='#8f8';ctx.lineWidth=1;ctx.beginPath();
  for(let i=0;i<show;i++){
    const mag=Math.sqrt(I[i]*I[i]+Q[i]*Q[i]);
    const x=i/show*w,y=h-mag*h*.4;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }ctx.stroke();
  ctx.fillStyle='#f84';ctx.font='10px monospace';ctx.fillText('Phase',4,12);
  ctx.fillStyle='#8f8';ctx.fillText('Magnitude',60,12);
}

function updateStats(I,Q){
  let irms=0,qrms=0,corr=0;
  for(let i=0;i<N;i++){irms+=I[i]*I[i];qrms+=Q[i]*Q[i];corr+=I[i]*Q[i];}
  irms=Math.sqrt(irms/N);qrms=Math.sqrt(qrms/N);corr=corr/N/(irms*qrms+1e-20);
  $('irmsVal').textContent=irms.toFixed(4);$('qrmsVal').textContent=qrms.toFixed(4);
  $('corrVal').textContent=corr.toFixed(4);
  // Image rejection
  const imbDb=20*Math.log10(Math.abs(irms-qrms)/(irms+qrms+1e-20)+1e-10);
  $('imgVal').textContent=(-imbDb).toFixed(1)+' dB';
  // Inst freq
  let fSum=0,cnt=0;
  for(let i=1;i<Math.min(256,N);i++){
    const p1=Math.atan2(Q[i],I[i]),p0=Math.atan2(Q[i-1],I[i-1]);
    let dp=p1-p0;if(dp>Math.PI)dp-=2*Math.PI;if(dp<-Math.PI)dp+=2*Math.PI;
    fSum+=dp*SR/(2*Math.PI);cnt++;
  }
  $('instVal').textContent=(fSum/cnt).toFixed(0)+' Hz';
}

function applyAutoCorrection(){
  // Estimate imbalance from current data
  const mode=$('iqMode').value,freq=+$('freqSlider').value;
  const gi=+$('gainSlider').value/10,pi=+$('phaseSlider').value;
  corrGain=Math.pow(10,gi/20);
  corrPhase=pi*Math.PI/180;
  autoCorr=true;
  const el=$('corrResult');if(el)el.textContent=`Correction: gain=${corrGain.toFixed(3)}, phase=${(corrPhase*180/Math.PI).toFixed(1)} deg`;
  log(LANG[currentLang].corrApplied,'success');
}

function simLoop(){
  if(!running)return;
  const mode=$('iqMode').value,freq=+$('freqSlider').value;
  const gi=+$('gainSlider').value/10,pi=+$('phaseSlider').value;
  const{I,Q}=generateIQ(mode,freq,gi,pi);
  drawIQPlane(I,Q);drawTimeIQ(I,Q);drawPhase(I,Q);updateStats(I,Q);
  animFrame=requestAnimationFrame(simLoop);
}
function startSim(){if(running)return;running=true;tOff=0;setStatus(true);log(LANG[currentLang].iqStarted,'success');simLoop();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].iqStopped,'info');}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  $('correctBtn').onclick=applyAutoCorrection;
  $('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' Hz';};
  $('gainSlider').oninput=function(){$('gainVal').textContent=(this.value/10).toFixed(1)+' dB';};
  $('phaseSlider').oninput=function(){$('phaseImbVal').textContent=this.value+' deg';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);
