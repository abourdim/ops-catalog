/**
 * Metadata Scrubber — EXIF & Trace Removal
 * Strip metadata from files: EXIF, GPS, author info simulation
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}

const LANG={
en:{title:'Metadata Scrubber',subtitle:'EXIF & trace removal simulation',disconnected:'Idle',connected:'Scrubbing',mainSection:'Metadata Scrub Engine',mainDesc:'EXIF, GPS coordinates, author & hidden tag removal',sectionA:'Scrub Operations',sectionC:'How It Works',start:'Start',stop:'Stop',filesScrubbed:'Files Scrubbed',tagsRemoved:'Tags Removed',gpsStripped:'GPS Stripped',cleanness:'Status',howItWorksText:'Metadata scrubbing removes identifying information embedded in files. EXIF data in photos reveals camera model and timestamps. GPS coordinates expose locations. Author tags link files to identities. Educational simulation.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is metadata?',faq_a1:'Hidden data embedded in files.',faq_q2:'Is this real?',faq_a2:'No, simulation only.',faq_q3:'Why remove metadata?',faq_a3:'To protect privacy.',faq_q4:'Is my data safe?',faq_a4:'Yes. Everything runs locally.',howto_1:'Select a scrub method.',howto_2:'Click Start.',howto_3:'Watch metadata being stripped.',howto_4:'Review the log.',wiki_exif_title:'EXIF Data',wiki_exif:'Camera info in photos.',wiki_gps_title:'GPS Coordinates',wiki_gps:'Location data in files.',wiki_privacy_title:'Privacy',wiki_privacy:'All local.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Scrubber ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Scrubbing started',simStopped:'Scrubbing stopped',opDone:'Scrubbed',step1Title:'Assess Situation',step1Desc:'Evaluate the threat environment and identify surveillance or tracking methods.',step2Title:'Select Technique',step2Desc:'Choose the appropriate evasion, obfuscation, or counter-surveillance method.',step3Title:'Execute Evasion',step3Desc:'Apply the chosen technique to avoid detection or escape monitoring.',step4Title:'Verify Clean',step4Desc:'Confirm that you have successfully evaded detection and are operating securely.'},
fr:{title:'Nettoyeur de Metadonnees',subtitle:'Suppression EXIF et traces',disconnected:'Inactif',connected:'Nettoyage',mainSection:'Moteur de Nettoyage',mainDesc:'Suppression EXIF, GPS, auteur',sectionA:'Operations',sectionC:'Comment ca marche',start:'Demarrer',stop:'Arreter',filesScrubbed:'Fichiers',tagsRemoved:'Tags',gpsStripped:'GPS',cleanness:'Statut',howItWorksText:'Le nettoyage supprime les metadonnees identifiantes des fichiers.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Metadonnees?',faq_a1:'Donnees cachees dans les fichiers.',faq_q2:'Reel?',faq_a2:'Non, simulation.',faq_q3:'Pourquoi nettoyer?',faq_a3:'Proteger la vie privee.',faq_q4:'Donnees sures?',faq_a4:'Oui, local.',howto_1:'Choisir methode.',howto_2:'Demarrer.',howto_3:'Observer.',howto_4:'Verifier.',wiki_exif_title:'EXIF',wiki_exif:'Info camera.',wiki_gps_title:'GPS',wiki_gps:'Localisation.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Nettoyage demarre',simStopped:'Arrete',opDone:'Nettoye',step1Title:'Évaluer la situation',step1Desc:'Évalue l\'environnement de menace et identifie les méthodes de surveillance.',step2Title:'Choisir la technique',step2Desc:'Sélectionne la méthode d\'évasion ou de contre-surveillance appropriée.',step3Title:'Exécuter l\'évasion',step3Desc:'Applique la technique choisie pour éviter la détection.',step4Title:'Vérifier la sécurité',step4Desc:'Confirme que tu as échappé à la détection et opères en sécurité.'},
ar:{title:'منظف البيانات الوصفية',subtitle:'محاكاة إزالة EXIF والآثار',disconnected:'خامل',connected:'تنظيف',mainSection:'محرك التنظيف',mainDesc:'إزالة EXIF وGPS والمؤلف',sectionA:'عمليات التنظيف',sectionC:'كيف يعمل',start:'بدء',stop:'إيقاف',filesScrubbed:'ملفات منظفة',tagsRemoved:'علامات محذوفة',gpsStripped:'GPS محذوف',cleanness:'الحالة',howItWorksText:'تنظيف البيانات الوصفية يزيل المعلومات التعريفية من الملفات.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هي البيانات الوصفية؟',faq_a1:'بيانات مخفية في الملفات.',faq_q2:'هل هذا حقيقي؟',faq_a2:'لا، محاكاة فقط.',faq_q3:'لماذا الإزالة؟',faq_a3:'لحماية الخصوصية.',faq_q4:'هل بياناتي آمنة؟',faq_a4:'نعم، كل شيء محلي.',howto_1:'اختر طريقة.',howto_2:'انقر بدء.',howto_3:'شاهد التنظيف.',howto_4:'راجع السجل.',wiki_exif_title:'EXIF',wiki_exif:'معلومات الكاميرا.',wiki_gps_title:'GPS',wiki_gps:'بيانات الموقع.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل شيء محلي.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ التنظيف',simStopped:'توقف',opDone:'تم التنظيف',step1Title:'تقييم الوضع',step1Desc:'قيّم بيئة التهديد وحدد أساليب المراقبة أو التتبع.',step2Title:'اختيار التقنية',step2Desc:'اختر طريقة التهرب أو التمويه أو مكافحة المراقبة المناسبة.',step3Title:'تنفيذ التهرب',step3Desc:'طبّق التقنية المختارة لتجنب الاكتشاف أو الهروب من المراقبة.',step4Title:'التحقق من الأمان',step4Desc:'تأكد من نجاح التهرب وأنك تعمل بشكل آمن.'}
};

let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`scrubber-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Metadata Scrubber ═══════ */
let simRunning=false,simInterval=null,filesScrubbed=0,tagsRemoved=0,gpsStripped=0,currentMethod='exif';
const FILE_NAMES=['IMG_20240315.jpg','DSC_0042.raw','vacation_photo.png','document.pdf','report.docx','audio_recording.mp3','video_clip.mp4','screenshot.bmp'];
const EXIF_TAGS=['Make:Canon','Model:EOS R5','DateTime:2024:03:15','GPS:48.8566,2.3522','Author:John Doe','Software:Photoshop','FocalLength:50mm','ISO:400','ExposureTime:1/250'];
let canvas,ctx,particles=[];

function genOp(){
  const file=FILE_NAMES[Math.floor(Math.random()*FILE_NAMES.length)];
  const tag=EXIF_TAGS[Math.floor(Math.random()*EXIF_TAGS.length)];
  if(currentMethod==='exif') return {type:'EXIF',data:`${file} → removed ${tag}`,status:'STRIPPED'};
  else if(currentMethod==='gps') return {type:'GPS',data:`${file} → coords purged [${(Math.random()*180-90).toFixed(4)},${(Math.random()*360-180).toFixed(4)}]`,status:'PURGED'};
  else return {type:'AUTH',data:`${file} → author/creator fields cleared`,status:'CLEANED'};
}

function initCanvas(){canvas=$('metaCanvas');if(!canvas)return;ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;ctx.scale(2,2)}

function drawCanvas(){
  if(!ctx)return;const w=canvas.offsetWidth,h=canvas.offsetHeight;
  ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
  const colors={exif:'#3b82f6',gps:'#22c55e',author:'#f59e0b'};const col=colors[currentMethod]||'#3b82f6';
  // Tag bubbles dissolving
  particles.forEach((p,i)=>{
    p.y-=p.vy;p.x+=Math.sin(p.life*5)*0.5;p.life-=0.012;p.sz*=0.998;
    if(p.life<=0){particles.splice(i,1);return;}
    ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,Math.PI*2);
    ctx.fillStyle=col;ctx.globalAlpha=p.life*0.5;ctx.fill();
    ctx.font='6px monospace';ctx.fillStyle='#fff';ctx.globalAlpha=p.life*0.7;ctx.textAlign='center';
    ctx.fillText(p.label,p.x,p.y+2);ctx.globalAlpha=1;
  });
  // File scan line
  const scanY=(Date.now()%3000)/3000*h;
  ctx.fillStyle=col+'30';ctx.fillRect(0,scanY-1,w,2);
  // Stats
  ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.3)';ctx.textAlign='center';
  ctx.fillText(`${tagsRemoved} metadata tags removed`,w/2,h-6);
}

function addParticles(){
  const w=canvas?canvas.offsetWidth:300,h=canvas?canvas.offsetHeight:200;
  const labels=['EXIF','GPS','Date','Make','ISO','Author','Soft','Lat','Lon'];
  for(let i=0;i<2;i++){
    particles.push({x:30+Math.random()*(w-60),y:h-20,vy:0.5+Math.random(),sz:8+Math.random()*6,life:1,label:labels[Math.floor(Math.random()*labels.length)]});
  }
  if(particles.length>200)particles.splice(0,50);
}

function updateUI(){
  $('filesScrubbed').textContent=filesScrubbed;
  $('tagsRemoved').textContent=tagsRemoved;
  $('gpsStripped').textContent=gpsStripped;
  $('cleanLevel').textContent=tagsRemoved>50?'Pristine':tagsRemoved>20?'Clean':'Scrubbing';
  $('cleanLevel').style.color=tagsRemoved>50?'#22c55e':tagsRemoved>20?'#3b82f6':'#f59e0b';
}

function addOpToList(op){
  const list=$('scrubList');if(!list)return;
  const d=document.createElement('div');d.className='scrub-item';
  d.innerHTML=`<span class="s-type">${op.type}</span><span class="s-data">${op.data}</span><span class="s-status">${op.status}</span>`;
  list.insertBefore(d,list.firstChild);if(list.children.length>100)list.removeChild(list.lastChild);
}

function simTick(){
  const op=genOp();filesScrubbed++;tagsRemoved+=1+Math.floor(Math.random()*3);
  if(currentMethod==='gps')gpsStripped++;
  addOpToList(op);addParticles();updateUI();log(`${op.type}: ${op.status} — ${op.data}`,'tx');
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  filesScrubbed=0;tagsRemoved=0;gpsStripped=0;particles=[];
  initCanvas();log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(simTick,400);
  requestAnimationFrame(function loop(){if(!simRunning)return;drawCanvas();requestAnimationFrame(loop)});
}

function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  document.querySelectorAll('.method-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.method-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');currentMethod=tab.dataset.method;playSound('click')})});
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS — Metadata Dissolve Visualization ═══════ */
(function metaVis(){
  const CVS_ID='metaDissolveVis';
  function ensureCanvas(){if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);const wrap=document.querySelector('.card');if(!wrap)return null;const card=document.createElement('div');card.className='card';card.innerHTML='<div class="card-header"><div class="card-title"><span class="icon">🔍</span> Metadata Analysis View</div></div>';const c=document.createElement('canvas');c.id=CVS_ID;c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c}
  let tags=[],_raf=null,frame=0;
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return}
    const ctx2=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;ctx2.scale(2,2);const w=W/2,h=H/2;
    ctx2.fillStyle='rgba(10,10,26,0.1)';ctx2.fillRect(0,0,w,h);frame++;
    const isRunning=typeof simRunning!=='undefined'&&simRunning;
    const colors={exif:'#3b82f6',gps:'#22c55e',author:'#f59e0b'};
    const col=colors[typeof currentMethod!=='undefined'?currentMethod:'exif']||'#3b82f6';
    if(isRunning&&frame%8===0){
      const tagNames=['EXIF:Make','GPS:Lat','Author','DateTime','ISO','Model','Software','FocalLen','GPS:Lon','Copyright'];
      tags.push({x:Math.random()*w,y:h/2+Math.random()*40-20,label:tagNames[Math.floor(Math.random()*tagNames.length)],alpha:1,sz:10+Math.random()*4});
    }
    tags.forEach((tg,i)=>{tg.alpha-=0.008;tg.sz*=0.99;tg.y-=0.3;if(tg.alpha<=0){tags.splice(i,1);return}
      ctx2.font=`${Math.round(tg.sz)}px monospace`;ctx2.fillStyle=col;ctx2.globalAlpha=tg.alpha*0.6;ctx2.textAlign='center';
      // Strike-through effect
      ctx2.fillText(tg.label,tg.x,tg.y);
      if(tg.alpha<0.5){ctx2.strokeStyle='#ef4444';ctx2.lineWidth=1;ctx2.globalAlpha=tg.alpha;ctx2.beginPath();ctx2.moveTo(tg.x-tg.sz*2,tg.y-3);ctx2.lineTo(tg.x+tg.sz*2,tg.y-3);ctx2.stroke()}
      ctx2.globalAlpha=1;
    });
    if(tags.length>100)tags.splice(0,30);
    // Clean meter
    const cleaned=typeof tagsRemoved!=='undefined'?tagsRemoved:0;
    const pct=Math.min(cleaned/80,1);
    ctx2.fillStyle='rgba(0,0,0,0.3)';ctx2.fillRect(10,h-12,w-20,6);ctx2.fillStyle=col+'80';ctx2.fillRect(10,h-12,(w-20)*pct,6);
    ctx2.font='7px monospace';ctx2.fillStyle='rgba(255,255,255,0.3)';ctx2.textAlign='center';ctx2.fillText(Math.round(pct*100)+'% metadata removed',w/2,h-2);
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
