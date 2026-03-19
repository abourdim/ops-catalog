/**
 * SDR Noise Floor — Workshop DIY v1.0
 * Analyze noise floor, thermal noise, NF, MDS, dynamic range
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="70" x2="95" y2="70" stroke="currentColor" stroke-width="1" opacity=".4" stroke-dasharray="4 3"/><path d="M5 70 L15 68 L25 72 L35 69 L45 71 L55 67 L65 73 L75 69 L85 71 L95 70" stroke="currentColor" fill="none" stroke-width="2" opacity=".6"><animate attributeName="d" values="M5 70 L15 68 L25 72 L35 69 L45 71 L55 67 L65 73 L75 69 L85 71 L95 70;M5 70 L15 72 L25 68 L35 71 L45 69 L55 73 L65 67 L75 71 L85 69 L95 70;M5 70 L15 68 L25 72 L35 69 L45 71 L55 67 L65 73 L75 69 L85 71 L95 70" dur="1s" repeatCount="indefinite"/></path><path d="M50 20 L50 55" stroke="currentColor" stroke-width="3"/><polygon points="45,55 55,55 50,65" fill="currentColor"/><text x="38" y="16" font-size="12" fill="currentColor" font-family="Orbitron">SIG</text></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

const LANG={
en:{title:'SDR Noise Floor',subtitle:'📉 Noise Floor — Understand receiver sensitivity',disconnected:'Disconnected',connected:'Connected',mainSection:'Noise Floor Analyzer',mainDesc:'Thermal noise, noise figure, MDS, dynamic range',sectionA:'Noise Calculations',sectionB:'Noise Distribution',sectionC:'Noise Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is noise floor?',faq_a1:'Minimum signal level a receiver can detect, set by thermal noise + NF.',faq_q2:'What is noise figure?',faq_a2:'Additional noise the receiver adds above theoretical thermal.',faq_q3:'What is MDS?',faq_a3:'Minimum Detectable Signal — weakest signal above noise floor.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
howto_1:'Set temperature, bandwidth, and noise figure.',howto_2:'Adjust test signal level.',howto_3:'Increase averaging to reduce noise.',howto_4:'Check Section A for computed values.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'📉 Noise Floor Analyzer ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
tempLabel:'Temperature (K)',bwLabel:'Bandwidth (kHz)',nfLabel:'Noise Figure (dB)',sigLevel:'Test Signal Level (dBm)',avgLabel:'Averaging',startNoise:'▶ Start',stopNoise:'⏹ Stop',
thermalNoise:'Thermal Noise (kTB):',noiseFloorCalc:'Noise Floor (kTB+NF):',mdsLabel:'MDS:',snrResult:'SNR at test signal:',dynRange:'Dynamic Range:',enb:'Equiv. Noise BW:',
histDesc:'Histogram of noise samples — Gaussian distribution expected.',
theoryIntro:'Understanding noise is critical for SDR receiver design:',theory1:'Thermal noise: P = kTB (k=1.38e-23, T=Kelvin, B=Hz)',theory2:'Noise Figure: receiver-added noise above thermal',theory3:'MDS: minimum detectable signal (NF + 3dB SNR)',theory4:'Averaging reduces noise by sqrt(N) — 3dB per doubling',theory5:'Dynamic range: noise floor to compression point',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',noiseStarted:'▶ Noise analysis running',noiseStopped:'⏹ Stopped',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Plancher de Bruit SDR',subtitle:'📉 Plancher de Bruit — Sensibilite du recepteur',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Analyseur de Bruit',mainDesc:'Bruit thermique, facteur de bruit, MDS, dynamique',sectionA:'Calculs de Bruit',sectionB:'Distribution du Bruit',sectionC:'Theorie du Bruit',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce que le plancher de bruit?',faq_a1:'Le niveau minimal detectable, defini par bruit thermique + NF.',faq_q2:'Qu\'est-ce que le facteur de bruit?',faq_a2:'Le bruit ajoute par le recepteur au-dessus du thermique.',faq_q3:'Qu\'est-ce que le MDS?',faq_a3:'Signal Minimum Detectable au-dessus du plancher.',faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout est local.',
howto_1:'Reglez temperature, bande passante et facteur de bruit.',howto_2:'Ajustez le niveau du signal test.',howto_3:'Augmentez le moyennage pour reduire le bruit.',howto_4:'Verifiez les calculs en Section A.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'📉 Analyseur de Bruit pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
tempLabel:'Temperature (K)',bwLabel:'Bande Passante (kHz)',nfLabel:'Facteur de Bruit (dB)',sigLevel:'Niveau Signal Test (dBm)',avgLabel:'Moyennage',startNoise:'▶ Demarrer',stopNoise:'⏹ Arreter',
thermalNoise:'Bruit Thermique (kTB):',noiseFloorCalc:'Plancher (kTB+NF):',mdsLabel:'MDS:',snrResult:'RSB au signal test:',dynRange:'Dynamique:',enb:'BW Bruit Equiv.:',
histDesc:'Histogramme des echantillons de bruit — distribution gaussienne attendue.',
theoryIntro:'Comprendre le bruit est essentiel pour la conception SDR:',theory1:'Bruit thermique: P = kTB',theory2:'Facteur de bruit: bruit ajoute par le recepteur',theory3:'MDS: signal minimum detectable',theory4:'Le moyennage reduit le bruit de sqrt(N)',theory5:'Dynamique: du plancher au point de compression',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',noiseStarted:'▶ Analyse en cours',noiseStopped:'⏹ Arrete',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'ارضية الضوضاء SDR',subtitle:'📉 ارضية الضوضاء — فهم حساسية المستقبل',disconnected:'غير متصل',connected:'متصل',mainSection:'محلل ارضية الضوضاء',mainDesc:'الضوضاء الحرارية، رقم الضوضاء، MDS، النطاق الديناميكي',sectionA:'حسابات الضوضاء',sectionB:'توزيع الضوضاء',sectionC:'نظرية الضوضاء',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
faq_q1:'ما هي ارضية الضوضاء؟',faq_a1:'اقل مستوى اشارة يمكن للمستقبل كشفه.',faq_q2:'ما هو رقم الضوضاء؟',faq_a2:'الضوضاء الاضافية التي يضيفها المستقبل فوق الحرارية.',faq_q3:'ما هو MDS؟',faq_a3:'اقل اشارة قابلة للكشف فوق ارضية الضوضاء.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',
howto_1:'اضبط الحرارة وعرض النطاق ورقم الضوضاء.',howto_2:'اضبط مستوى اشارة الاختبار.',howto_3:'زد المتوسط لتقليل الضوضاء.',howto_4:'تحقق من القسم أ للحسابات.',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'📉 محلل ارضية الضوضاء جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
tempLabel:'الحرارة (كلفن)',bwLabel:'عرض النطاق (كيلوهرتز)',nfLabel:'رقم الضوضاء (ديسيبل)',sigLevel:'مستوى اشارة الاختبار (dBm)',avgLabel:'المتوسط',startNoise:'▶ ابدا',stopNoise:'⏹ ايقاف',
thermalNoise:'الضوضاء الحرارية (kTB):',noiseFloorCalc:'ارضية الضوضاء (kTB+NF):',mdsLabel:'MDS:',snrResult:'نسبة الاشارة للضوضاء:',dynRange:'النطاق الديناميكي:',enb:'عرض نطاق الضوضاء المكافئ:',
histDesc:'مدرج تكراري لعينات الضوضاء — توزيع غاوسي متوقع.',
theoryIntro:'فهم الضوضاء اساسي لتصميم مستقبلات SDR:',theory1:'الضوضاء الحرارية: P = kTB',theory2:'رقم الضوضاء: الضوضاء المضافة بواسطة المستقبل',theory3:'MDS: اقل اشارة قابلة للكشف',theory4:'المتوسط يقلل الضوضاء بمقدار جذر N',theory5:'النطاق الديناميكي: من ارضية الضوضاء الى نقطة الانضغاط',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',noiseStarted:'▶ تحليل الضوضاء يعمل',noiseStopped:'⏹ متوقف',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='noise-floor-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
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

/* ═══════ NOISE SIMULATION ═══════ */
let running=false,animFrame=null;
const k_BOLTZ=1.38e-23;
const N=512;
let avgBuf=null,avgCount=0;
const histBins=new Float32Array(50);

function gaussRandom(){let u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

function generateNoiseSpectrum(temp,bwHz,nfDb,sigDbm,avgN){
  const ktb_w=k_BOLTZ*temp*bwHz;
  const ktb_dbm=10*Math.log10(ktb_w)+30;
  const nfloor_dbm=ktb_dbm+nfDb;
  const noiseLinear=Math.pow(10,nfloor_dbm/10)*1e-3;
  const noiseStd=Math.sqrt(noiseLinear);
  const sigLinear=Math.pow(10,sigDbm/10)*1e-3;
  const sigAmp=Math.sqrt(sigLinear);
  // Generate spectrum with noise + signal
  const spec=new Float32Array(N);
  const sigBin=Math.floor(N*.4);// signal at 40% of span
  const samples=new Float32Array(N);
  for(let i=0;i<N;i++){
    // Noise floor in each bin
    let noisePwr=noiseStd*Math.abs(gaussRandom());
    // Add signal
    if(Math.abs(i-sigBin)<3)noisePwr+=sigAmp*Math.exp(-(i-sigBin)*(i-sigBin)/2);
    spec[i]=noisePwr;
    samples[i]=gaussRandom()*noiseStd;
  }
  // Averaging
  if(!avgBuf||avgBuf.length!==N){avgBuf=new Float32Array(N);avgCount=0;}
  for(let i=0;i<N;i++)avgBuf[i]=(avgBuf[i]*avgCount+spec[i])/(avgCount+1);
  avgCount++;if(avgCount>=avgN)avgCount=Math.floor(avgN*.8);
  // Histogram
  histBins.fill(0);const hmin=-4*noiseStd,hmax=4*noiseStd,hrange=hmax-hmin;
  for(let i=0;i<N;i++){const bin=Math.floor((samples[i]-hmin)/hrange*50);if(bin>=0&&bin<50)histBins[bin]++;}
  return{spec:avgBuf,ktb_dbm,nfloor_dbm,sigDbm,samples};
}

function drawNoiseSpec(spec,nfloor_dbm){
  const c=$('noiseCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  // Grid
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=1;i<8;i++){const y=i/8*h;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  // Noise floor reference line
  const nfY=h*.6;
  ctx.strokeStyle='#f44';ctx.lineWidth=1;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(0,nfY);ctx.lineTo(w,nfY);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#f44';ctx.font='9px monospace';ctx.fillText('Noise Floor: '+nfloor_dbm.toFixed(1)+' dBm',w-180,nfY-4);
  // Spectrum
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const mx=Math.max(...spec)||1;
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<spec.length;i++){
    const x=i/spec.length*w;
    const db=20*Math.log10(spec[i]/mx+1e-10);
    const y=h-((db+80)/80)*h;
    if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));
  }
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Noise Floor Spectrum',4,12);
}

function drawWaterfall(spec){
  const c=$('waterfallCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const img=ctx.getImageData(0,0,w,h-1);ctx.putImageData(img,0,1);
  const mx=Math.max(...spec)||1;
  for(let x=0;x<w;x++){
    const idx=Math.floor(x/w*spec.length);
    const db=Math.max(0,Math.min(1,(20*Math.log10(spec[idx]/mx+1e-10)+60)/60));
    let r,g,b;
    if(db<.25){r=0;g=0;b=Math.floor(db*4*200);}
    else if(db<.5){r=0;g=Math.floor((db-.25)*4*200);b=200;}
    else if(db<.75){r=Math.floor((db-.5)*4*255);g=200;b=200-Math.floor((db-.5)*4*200);}
    else{r=255;g=200-Math.floor((db-.75)*4*200);b=0;}
    ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(x,0,1,1);
  }
}

function drawHistogram(){
  const c=$('histCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const mx=Math.max(...histBins)||1;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const bw=w/histBins.length;
  for(let i=0;i<histBins.length;i++){
    const bh=(histBins[i]/mx)*h*.9;
    ctx.fillStyle=accent+'99';ctx.fillRect(i*bw+1,h-bh,bw-2,bh);
  }
  // Gaussian overlay
  ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();
  for(let i=0;i<histBins.length;i++){
    const x=(i+.5)/histBins.length;const gauss=Math.exp(-Math.pow((x-.5)*6,2)/2);
    const px=i*bw+bw/2,py=h-gauss*h*.85;
    if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px monospace';ctx.fillText('Noise Distribution (Gaussian)',4,12);
}

function updateCalcs(ktb_dbm,nfloor_dbm,sigDbm,bwHz){
  $('ktbVal').textContent=ktb_dbm.toFixed(1)+' dBm';
  $('nfloorVal').textContent=nfloor_dbm.toFixed(1)+' dBm';
  const mds=nfloor_dbm+3;// 3dB SNR for detection
  $('mdsVal').textContent=mds.toFixed(1)+' dBm';
  const snr=sigDbm-nfloor_dbm;
  $('snrResVal').textContent=snr.toFixed(1)+' dB';
  $('dynVal').textContent=(0-nfloor_dbm).toFixed(1)+' dB';// 0dBm compression assumed
  $('enbVal').textContent=(bwHz).toFixed(0)+' Hz';
}

function simLoop(){
  if(!running)return;
  const temp=+$('tempSlider').value,bwKhz=+$('bwSlider').value,nf=+$('nfSlider').value;
  const sigDbm=+$('sigSlider').value,avgN=+$('avgSlider').value;
  const bwHz=bwKhz*1000;
  const{spec,ktb_dbm,nfloor_dbm}=generateNoiseSpectrum(temp,bwHz,nf,sigDbm,avgN);
  drawNoiseSpec(spec,nfloor_dbm);drawWaterfall(spec);drawHistogram();
  updateCalcs(ktb_dbm,nfloor_dbm,sigDbm,bwHz);
  animFrame=requestAnimationFrame(simLoop);
}
function startSim(){if(running)return;running=true;avgBuf=null;avgCount=0;setStatus(true);log(LANG[currentLang].noiseStarted,'success');simLoop();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].noiseStopped,'info');}

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
  $('tempSlider').oninput=function(){$('tempVal').textContent=this.value+' K';};
  $('bwSlider').oninput=function(){$('bwVal').textContent=this.value+' kHz';};
  $('nfSlider').oninput=function(){$('nfVal').textContent=this.value+' dB';};
  $('sigSlider').oninput=function(){$('sigVal').textContent=this.value+' dBm';};
  $('avgSlider').oninput=function(){$('avgVal').textContent=this.value+'x';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Noise Floor
   Animated thermal noise waterfall + noise figure cascade
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('noiseSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='noiseSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#040608;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.016;
  // Scroll noise waterfall up
  const imgData=cx.getImageData(0,0,W,H-1);cx.putImageData(imgData,0,1);
  // New noise line at top
  for(let x=0;x<W;x++){
    const nf=Math.random();const v=nf*nf;
    const r=v*40|0,g=v*60|0,b=80+v*175|0;
    cx.fillStyle=`rgb(${r},${g},${b})`;cx.fillRect(x,0,1,1);
  }
  // Signal peak emerging from noise
  const sigX=W/2+Math.sin(t*.5)*100;const sigW=20+Math.sin(t*.3)*8;
  for(let x=sigX-sigW;x<sigX+sigW;x++){
    if(x<0||x>=W)continue;
    const d=Math.abs(x-sigX)/sigW;const v=1-d*d;
    const r=v*200+55|0,g=v*150+50|0,b=50;
    cx.fillStyle=`rgb(${r},${g},${b})`;cx.fillRect(x,0,1,1);
  }
  // NF cascade overlay at bottom
  cx.fillStyle='rgba(0,0,0,.6)';cx.fillRect(0,H-28,W,28);
  const stages=['ANT','LNA','MIXER','IF AMP','ADC'];
  const nfs=[0,1.5,8,3,6];let cumNF=0;
  stages.forEach((s,i)=>{
    const sx=20+i*(W/5-4);
    cumNF+=nfs[i];
    cx.fillStyle='rgba(100,200,255,.15)';cx.fillRect(sx,H-26,W/5-12,22);
    cx.fillStyle='rgba(100,200,255,.6)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText(`${s} NF=${nfs[i]}dB`,sx+(W/5-12)/2,H-11);
  });
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText(`Thermal Noise Waterfall | System NF: ${cumNF.toFixed(1)} dB`,8,H-30);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
