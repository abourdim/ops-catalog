/**
 * SE-Deepfake-Voice-Cloner — Workshop DIY v1.0
 * Simulates AI voice cloning for security awareness education.
 * Framework: Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas sim
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'Deepfake Voice Cloner', subtitle:'Simulate AI voice cloning threats',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Deepfake Voice Cloner', mainDesc:'AI voice cloning simulation for security awareness',
    sectionA:'Voice Waveform', sectionB:'Clone Analysis', sectionC:'Detection Log',
    recordBtn:'Record', cloneBtn:'Clone Voice', playOrig:'Original', playClone:'Cloned', detectBtn:'Detect Fake',
    similarityLabel:'Clone Similarity', similarityDesc:'AI model confidence',
    spectrumLabel:'Frequency Spectrum',
    voiceMale:'Male Voice', voiceFemale:'Female Voice', voiceChild:'Child Voice',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', filterAll:'All',
    settings:'Settings', language:'Language', theme:'Theme', soundEffects:'Sound effects',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    faq_q1:'What is deepfake voice cloning?', faq_a1:'AI technology that replicates a person\'s voice from audio samples.',
    faq_q2:'Is this real cloning?', faq_a2:'No. This is an educational simulation.',
    faq_q3:'How to detect deepfakes?', faq_a3:'Look for unnatural pauses, metallic artifacts, inconsistent pitch.',
    faq_q4:'Is my data private?', faq_a4:'Yes. Everything runs locally in your browser.',
    howto_1:'Select a voice type and click Record.', howto_2:'Click Clone Voice to simulate AI synthesis.',
    howto_3:'Compare original vs cloned waveforms.', howto_4:'Use Detect Fake to identify artifacts.',
    wiki_t1:'Deepfake Audio', wiki_d1:'AI models learn voice characteristics from short samples.',
    wiki_t2:'Detection', wiki_d2:'Spectral analysis and AI classifiers identify synthetic audio.',
    ready:'Deepfake Voice Cloner ready.',
    recording:'Recording voice sample...', recordDone:'Voice sample captured.',
    cloning:'Cloning voice with AI model...', cloneDone:'Voice clone generated!',
    detecting:'Running deepfake detection...', detected:'Artifacts detected: metallic resonance at high frequencies.',
    playingOrig:'Playing original sample...', playingClone:'Playing cloned sample...',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    working:'Working...', splashHint:'tap to skip',
    langChanged:'Language → English', themeChanged:'Theme →',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  },
  fr: {
    title:'Clonage Vocal Deepfake', subtitle:'Simuler les menaces de clonage vocal IA',
    disconnected:'Déconnecté', connected:'Connecté',
    mainSection:'Clonage Vocal Deepfake', mainDesc:'Simulation de clonage vocal IA pour la sensibilisation',
    sectionA:'Forme d\'Onde Vocale', sectionB:'Analyse du Clone', sectionC:'Journal de Détection',
    recordBtn:'Enregistrer', cloneBtn:'Cloner la Voix', playOrig:'Original', playClone:'Cloné', detectBtn:'Détecter le Faux',
    similarityLabel:'Similarité du Clone', similarityDesc:'Confiance du modèle IA',
    spectrumLabel:'Spectre de Fréquence',
    voiceMale:'Voix Masculine', voiceFemale:'Voix Féminine', voiceChild:'Voix d\'Enfant',
    activityLog:'Journal', eventsMsg:'Événements',
    clear:'Effacer', copy:'Copier', export:'Exporter', filterAll:'Tout',
    settings:'Paramètres', language:'Langue', theme:'Thème', soundEffects:'Effets sonores',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    faq_q1:'Qu\'est-ce que le clonage vocal deepfake?', faq_a1:'Technologie IA qui réplique la voix d\'une personne.',
    faq_q2:'Est-ce un vrai clonage?', faq_a2:'Non. C\'est une simulation éducative.',
    faq_q3:'Comment détecter les deepfakes?', faq_a3:'Cherchez les pauses non naturelles, artefacts métalliques.',
    faq_q4:'Mes données sont-elles privées?', faq_a4:'Oui. Tout fonctionne localement.',
    howto_1:'Sélectionnez un type de voix et cliquez Enregistrer.', howto_2:'Cliquez Cloner pour simuler la synthèse IA.',
    howto_3:'Comparez les formes d\'onde originale vs clonée.', howto_4:'Utilisez Détecter pour identifier les artefacts.',
    wiki_t1:'Audio Deepfake', wiki_d1:'Les modèles IA apprennent les caractéristiques vocales.',
    wiki_t2:'Détection', wiki_d2:'L\'analyse spectrale identifie l\'audio synthétique.',
    ready:'Clonage Vocal Deepfake prêt.',
    recording:'Enregistrement de l\'échantillon...', recordDone:'Échantillon vocal capturé.',
    cloning:'Clonage de la voix avec le modèle IA...', cloneDone:'Clone vocal généré!',
    detecting:'Détection de deepfake en cours...', detected:'Artefacts détectés: résonance métallique.',
    playingOrig:'Lecture de l\'échantillon original...', playingClone:'Lecture de l\'échantillon cloné...',
    logCleared:'Journal effacé', copied:'Copié!', copyFail:'Échec',
    working:'En cours...', splashHint:'appuyer pour passer',
    langChanged:'Langue → Français', themeChanged:'Thème →',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  },
  ar: {
    title:'مُستنسخ الصوت المزيّف', subtitle:'محاكاة تهديدات استنساخ الصوت بالذكاء الاصطناعي',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'مُستنسخ الصوت المزيّف', mainDesc:'محاكاة استنساخ الصوت للتوعية الأمنية',
    sectionA:'موجة الصوت', sectionB:'تحليل الاستنساخ', sectionC:'سجل الكشف',
    recordBtn:'تسجيل', cloneBtn:'استنساخ الصوت', playOrig:'الأصلي', playClone:'المستنسخ', detectBtn:'كشف التزييف',
    similarityLabel:'تشابه الاستنساخ', similarityDesc:'ثقة نموذج الذكاء الاصطناعي',
    spectrumLabel:'طيف التردد',
    voiceMale:'صوت ذكر', voiceFemale:'صوت أنثى', voiceChild:'صوت طفل',
    activityLog:'سجل النشاط', eventsMsg:'الأحداث والرسائل',
    clear:'مسح', copy:'نسخ', export:'تصدير', filterAll:'الكل',
    settings:'الإعدادات', language:'اللغة', theme:'المظهر', soundEffects:'المؤثرات الصوتية',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    faq_q1:'ما هو استنساخ الصوت المزيّف؟', faq_a1:'تقنية ذكاء اصطناعي تستنسخ صوت شخص من عينات صوتية.',
    faq_q2:'هل هذا استنساخ حقيقي؟', faq_a2:'لا. هذه محاكاة تعليمية.',
    faq_q3:'كيف تكشف التزييف؟', faq_a3:'ابحث عن توقفات غير طبيعية وأصوات معدنية.',
    faq_q4:'هل بياناتي خاصة؟', faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.',
    howto_1:'اختر نوع الصوت وانقر تسجيل.', howto_2:'انقر استنساخ لمحاكاة التوليف.',
    howto_3:'قارن بين الموجات الأصلية والمستنسخة.', howto_4:'استخدم كشف التزييف لتحديد الشوائب.',
    wiki_t1:'الصوت المزيّف', wiki_d1:'نماذج الذكاء الاصطناعي تتعلم خصائص الصوت.',
    wiki_t2:'الكشف', wiki_d2:'التحليل الطيفي يحدد الصوت الاصطناعي.',
    ready:'مُستنسخ الصوت المزيّف جاهز.',
    recording:'جارٍ تسجيل العينة الصوتية...', recordDone:'تم التقاط العينة الصوتية.',
    cloning:'جارٍ استنساخ الصوت...', cloneDone:'تم توليد الصوت المستنسخ!',
    detecting:'جارٍ كشف التزييف...', detected:'تم اكتشاف شوائب: رنين معدني في الترددات العالية.',
    playingOrig:'تشغيل العينة الأصلية...', playingClone:'تشغيل العينة المستنسخة...',
    logCleared:'تم مسح السجل', copied:'تم النسخ!', copyFail:'فشل النسخ',
    working:'جارٍ...', splashHint:'انقر للتخطي',
    langChanged:'اللغة ← العربية', themeChanged:'المظهر ←',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  }
};

let currentLang = 'en';
function T(k){ return (LANG[currentLang]||LANG.en)[k]||k; }

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){
  if(!soundEnabled)return;
  if(!audioCtx) audioCtx=new AudioCtx();
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;
  const t=audioCtx.currentTime;
  if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}
  else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}
  else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}
}

/* ═══════ LANGUAGE ═══════ */
function setLanguage(lang){
  currentLang=lang;
  const s=LANG[lang]; if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});
  document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});
  document.title=s.title+' — Workshop DIY';
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.documentElement.lang=lang;
  const sel=$('langSelect');if(sel)sel.value=lang;
  try{localStorage.setItem('wdiy-lang',lang);}catch{}
  log(s.langChanged,'info');
}

/* ═══════ THEME ═══════ */
function setTheme(name){
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect');if(sel)sel.value=name;
  try{localStorage.setItem('wdiy-theme',name);}catch{}
  log(T('themeChanged')+' '+name,'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const d=document.createElement('div');d.className='log-line '+type;
  d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;
  logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success');else if(type==='error')playSound('error');
  applyLogFilter();
}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(T('logCleared'));}
async function copyLog(){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');
  try{await navigator.clipboard.writeText(t);log(T('copied'),'success');}catch{log(T('copyFail'),'error');}
}
function exportLog(){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');
  const b=new Blob([t],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();URL.revokeObjectURL(u);
}

/* ═══════ TOAST ═══════ */
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||T('working');el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}

/* ═══════ STATUS ═══════ */
function setStatus(c){const t=$('statusText');if(t)t.textContent=c?T('connected'):T('disconnected');const p=$('statusPill');if(p)p.classList.toggle('connected',c);}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ LOG FILTER ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ HIJRI ═══════ */
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════ PANELS ═══════ */
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open');}
function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');s&&s.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const el=$(id);if(el)el.classList.add('active');});});}

/* ═══════ CANVAS SIM — Voice Waveform ═══════ */
let waveAnim, specAnim;
let isRecording=false, isCloned=false;
let origData=[], cloneData=[];
let similarity=0, freq=0;

function initWaveCanvas(){
  const c=$('waveCanvas'); if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||800; c.height=200;
  let t=0;
  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.1)';ctx.fillRect(0,0,c.width,c.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
    for(let x=0;x<c.width;x++){
      const voice=$('voiceSelect')?$('voiceSelect').value:'male';
      const baseF=voice==='male'?120:voice==='female'?220:340;
      const amp=isRecording?60+Math.sin(t*0.01)*20:10;
      const y=c.height/2+Math.sin(x*0.02+t*0.05)*amp*Math.sin(x*0.005+t*0.02)+Math.sin(x*baseF/8000+t*0.03)*amp*0.5;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
    if(isRecording){
      ctx.fillStyle=accent;ctx.globalAlpha=0.3;
      ctx.fillRect(c.width-60,10,50,20);ctx.globalAlpha=1;
      ctx.fillStyle='#f00';ctx.beginPath();ctx.arc(c.width-50,20,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='10px Orbitron,monospace';ctx.fillText('REC',c.width-42,24);
    }
    t++;
    waveAnim=requestAnimationFrame(draw);
  }
  draw();
}

function initSpecCanvas(){
  const c=$('specCanvas'); if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||800; c.height=200;
  let t=0;
  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    const bars=64;
    const bw=c.width/bars;
    for(let i=0;i<bars;i++){
      const origH=origData[i]||0;
      const cloneH=cloneData[i]||0;
      // Original bars (left)
      ctx.fillStyle='rgba(100,200,255,0.6)';
      ctx.fillRect(i*bw,c.height-origH,bw*0.4,origH);
      // Clone bars (right)
      ctx.fillStyle=isCloned?'rgba(255,100,100,0.6)':'rgba(50,50,50,0.3)';
      ctx.fillRect(i*bw+bw*0.45,c.height-cloneH,bw*0.4,cloneH);
    }
    ctx.fillStyle='#fff';ctx.font='10px Orbitron,monospace';
    ctx.fillText('BLUE=Original  RED=Clone',10,15);
    t++;
    specAnim=requestAnimationFrame(draw);
  }
  draw();
}

function doRecord(){
  isRecording=true;
  log(T('recording'),'info');
  showToast(T('recording'));
  setStatus(true);
  origData=[];
  for(let i=0;i<64;i++){
    const v=$('voiceSelect')?$('voiceSelect').value:'male';
    const base=v==='male'?80:v==='female'?60:40;
    origData.push(base+Math.random()*100);
  }
  freq=Math.round(($('voiceSelect').value==='male'?120:$('voiceSelect').value==='female'?220:340)+Math.random()*50);
  $('freqVal').textContent=freq+' Hz';
  $('pitchLabel').textContent='Pitch: '+(freq<200?'Low':freq<300?'Medium':'High');
  setTimeout(()=>{
    isRecording=false;
    hideToast();
    log(T('recordDone'),'success');
  },2000);
}

function doClone(){
  if(origData.length===0){log('Record a voice first','error');return;}
  log(T('cloning'),'info');
  showToast(T('cloning'));
  let progress=0;
  const iv=setInterval(()=>{
    progress+=Math.random()*15;
    similarity=Math.min(97,Math.round(progress));
    $('similarityVal').textContent=similarity+'%';
    cloneData=origData.map(v=>v*(0.85+Math.random()*0.3));
    if(progress>=97){
      clearInterval(iv);
      isCloned=true;
      hideToast();
      log(T('cloneDone'),'success');
      const dl=$('detectionLog');
      if(dl)dl.textContent+='\\n[AI] Clone generated with '+similarity+'% similarity.\\n[AI] Model: WaveNet-SE v3.2 | Params: 3.2M';
    }
  },200);
}

function doDetect(){
  if(!isCloned){log('Clone a voice first','error');return;}
  log(T('detecting'),'info');
  showToast(T('detecting'));
  setTimeout(()=>{
    hideToast();
    log(T('detected'),'success');
    const dl=$('detectionLog');
    if(dl)dl.textContent+='\\n[DETECT] Spectral anomaly at '+Math.round(freq*2.5)+'Hz\\n[DETECT] Phase discontinuity score: 0.'+Math.round(Math.random()*40+60)+'\\n[DETECT] Verdict: LIKELY DEEPFAKE';
  },1500);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  // Log buttons
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  // Panels
  if($('helpBtn'))$('helpBtn').onclick=openHelp;
  if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;
  if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;
  if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;
  if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;
  if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  // Sound
  const st=$('soundToggle');
  if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  // Language & Theme
  const ls=$('langSelect'),ts=$('themeSelect');
  if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  // Escape
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  // Hijri
  initHijriDate();
  // Canvas
  initWaveCanvas();
  initSpecCanvas();
  // Sim buttons
  if($('recordBtn'))$('recordBtn').onclick=doRecord;
  if($('cloneBtn'))$('cloneBtn').onclick=doClone;
  if($('playOrigBtn'))$('playOrigBtn').onclick=()=>log(T('playingOrig'),'info');
  if($('playCloneBtn'))$('playCloneBtn').onclick=()=>log(T('playingClone'),'info');
  if($('detectBtn'))$('detectBtn').onclick=doDetect;

  log(T('ready'),'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
