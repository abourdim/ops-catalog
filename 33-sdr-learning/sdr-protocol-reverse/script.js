/**
 * SDR Protocol Reverse — Workshop DIY v1.0
 * Reverse engineer RF protocols with visual bit-level analysis.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}

const LANG = {
  en: {
    title:'SDR Protocol Reverse',subtitle:'Reverse Engineer RF Protocols',
    disconnected:'Idle',connected:'Analyzing',
    mainSection:'Protocol Analyzer',mainDesc:'Capture, decode, and reverse RF protocol frames',
    sectionA:'Frame Analysis',sectionB:'Protocol Theory',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    faq_q1:'What is Protocol Reverse?',faq_a1:'A tool to analyze and decode simulated RF protocol transmissions.',
    faq_q2:'How do I use it?',faq_a2:'Select a protocol, capture, then decode to see bit-level breakdown.',
    faq_q3:'What protocols?',faq_a3:'ASK/OOK, FSK, PSK/BPSK, and Manchester encoding.',
    faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
    howto_1:'Choose a protocol type and baud rate.',howto_2:'Click Capture to generate a simulated transmission.',
    howto_3:'Click Decode to extract bits and frame structure.',howto_4:'Examine the frame analysis.',
    wiki_themes_title:'Themes',wiki_themes:'8 built-in themes.',
    wiki_i18n_title:'Languages',wiki_i18n:'Trilingual: EN, FR, AR.',
    working:'Working...',filterAll:'All',soundEffects:'Sound effects',
    ready:'Protocol Reverse ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    protocolLabel:'Protocol',baudLabel:'Baud Rate',noiseLabel:'Noise',
    capture:'Capture Signal',decode:'Decode Bits',resetProto:'Reset',
    detectedProto:'Protocol:',detectedBaud:'Baud Rate:',preamble:'Preamble:',payload:'Payload:',crc:'CRC:',
    theoryIntro:'RF protocol reverse engineering involves analyzing signal patterns:',
    theory1:'ASK/OOK: Amplitude shift keying toggles carrier on/off',
    theory2:'FSK: Frequency shift keying uses two frequencies',
    theory3:'Manchester: transitions in the middle of each bit period',
    theory4:'Preamble patterns help synchronize the receiver',
    theory5:'CRC checksums verify data integrity',
    captured:'Signal captured',decoded:'Frame decoded',
    splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.'},
  fr: {
    title:'Reverse Protocole SDR',subtitle:'Retro-ingenierie des protocoles RF',
    disconnected:'Inactif',connected:'Analyse',
    mainSection:'Analyseur de Protocole',mainDesc:'Capturer, decoder et analyser les trames RF',
    sectionA:'Analyse de Trame',sectionB:'Theorie des Protocoles',
    activityLog:'Journal',eventsMsg:'Evenements',
    clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    faq_q1:'Qu\'est-ce que le Reverse Protocole?',faq_a1:'Outil d\'analyse de transmissions RF simulees.',
    faq_q2:'Comment l\'utiliser?',faq_a2:'Selectionnez un protocole, capturez, puis decodez.',
    faq_q3:'Quels protocoles?',faq_a3:'ASK/OOK, FSK, PSK/BPSK et Manchester.',
    faq_q4:'Donnees privees?',faq_a4:'Oui. Tout est local.',
    howto_1:'Choisissez un type de protocole.',howto_2:'Cliquez Capturer.',
    howto_3:'Cliquez Decoder.',howto_4:'Examinez l\'analyse de trame.',
    wiki_themes_title:'Themes',wiki_themes:'8 themes.',
    wiki_i18n_title:'Langues',wiki_i18n:'Trilingue.',
    working:'En cours...',filterAll:'Tout',soundEffects:'Effets sonores',
    ready:'Reverse Protocole pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',
    protocolLabel:'Protocole',baudLabel:'Debit Baud',noiseLabel:'Bruit',
    capture:'Capturer',decode:'Decoder',resetProto:'Reinitialiser',
    detectedProto:'Protocole:',detectedBaud:'Debit:',preamble:'Preambule:',payload:'Charge utile:',crc:'CRC:',
    theoryIntro:'La retro-ingenierie de protocoles RF analyse les motifs de signaux:',
    theory1:'ASK/OOK: modulation d\'amplitude',theory2:'FSK: modulation de frequence',
    theory3:'Manchester: transitions au milieu de chaque bit',theory4:'Le preambule synchronise le recepteur',
    theory5:'Le CRC verifie l\'integrite',
    captured:'Signal capture',decoded:'Trame decodee',
    splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.'},
  ar: {
    title:'عكس بروتوكول SDR',subtitle:'هندسة عكسية لبروتوكولات RF',
    disconnected:'خامل',connected:'تحليل',
    mainSection:'محلل البروتوكول',mainDesc:'التقاط وفك تشفير وعكس اطارات بروتوكول RF',
    sectionA:'تحليل الاطار',sectionB:'نظرية البروتوكول',
    activityLog:'سجل النشاط',eventsMsg:'الاحداث',
    clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيفية',wiki:'ويكي',
    faq_q1:'ما هو عكس البروتوكول؟',faq_a1:'اداة لتحليل وفك تشفير ارسالات RF المحاكاة.',
    faq_q2:'كيف استخدمه؟',faq_a2:'اختر بروتوكولا والتقط ثم فك الشفرة.',
    faq_q3:'ما البروتوكولات المدعومة؟',faq_a3:'ASK/OOK, FSK, PSK/BPSK ومانشستر.',
    faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',
    howto_1:'اختر نوع البروتوكول.',howto_2:'انقر التقاط.',
    howto_3:'انقر فك الشفرة.',howto_4:'افحص تحليل الاطار.',
    wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',
    wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات.',
    working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات صوتية',
    ready:'عكس البروتوكول جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',
    protocolLabel:'البروتوكول',baudLabel:'معدل البود',noiseLabel:'الضوضاء',
    capture:'التقاط الاشارة',decode:'فك الشفرة',resetProto:'اعادة',
    detectedProto:'البروتوكول:',detectedBaud:'المعدل:',preamble:'المقدمة:',payload:'الحمولة:',crc:'CRC:',
    theoryIntro:'الهندسة العكسية لبروتوكولات RF تحلل انماط الاشارات:',
    theory1:'ASK/OOK: تضمين السعة يبدل الحامل',theory2:'FSK: تضمين التردد يستخدم ترددين',
    theory3:'مانشستر: انتقالات في منتصف كل بت',theory4:'المقدمة تساعد في مزامنة المستقبل',
    theory5:'CRC يتحقق من سلامة البيانات',
    captured:'تم التقاط الاشارة',decoded:'تم فك تشفير الاطار',
    splashHint:'انقر للتخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'
  ,step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='protocol-reverse-log.txt';a.click();URL.revokeObjectURL(u);}
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

/* ═══════ PROTOCOL SIMULATION ═══════ */
let capturedSignal=null, decodedBits=null;
const PREAMBLE=[1,0,1,0,1,0,1,0];

function generateBits(n){const b=[];for(let i=0;i<n;i++)b.push(Math.random()>0.5?1:0);return b;}
function crc8(bits){let crc=0;for(const b of bits){crc^=b?0xFF:0;for(let i=0;i<8;i++){if(crc&0x80)crc=(crc<<1)^0x07;else crc<<=1;crc&=0xFF;}}return crc;}

function encodeBits(bits,proto,baud,sampleRate){
  const samplesPerBit=Math.floor(sampleRate/baud);
  const n=bits.length*samplesPerBit;
  const buf=new Float32Array(n);
  const carrierFreq=2000;
  for(let bi=0;bi<bits.length;bi++){
    const bit=bits[bi];
    for(let s=0;s<samplesPerBit;s++){
      const idx=bi*samplesPerBit+s;
      const t=idx/sampleRate;
      if(proto==='ask'){
        buf[idx]=bit?Math.sin(2*Math.PI*carrierFreq*t):0;
      }else if(proto==='fsk'){
        const f=bit?carrierFreq+400:carrierFreq-400;
        buf[idx]=Math.sin(2*Math.PI*f*t);
      }else if(proto==='psk'){
        const phase=bit?0:Math.PI;
        buf[idx]=Math.sin(2*Math.PI*carrierFreq*t+phase);
      }else if(proto==='manchester'){
        const half=samplesPerBit/2;
        const val=s<half?(bit?1:-1):(bit?-1:1);
        buf[idx]=val*Math.sin(2*Math.PI*carrierFreq*t);
      }
    }
  }
  return buf;
}

function addNoise(buf,level){
  const out=new Float32Array(buf.length);
  for(let i=0;i<buf.length;i++)out[i]=buf[i]+(Math.random()-0.5)*level*2;
  return out;
}

function drawSignal(buf,canvasId,label){
  const c=$(canvasId);if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle='#1a2a3a';for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(0,i*h/5);ctx.lineTo(w,i*h/5);ctx.stroke();}
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  const step=Math.max(1,Math.floor(buf.length/w));
  for(let i=0;i<w;i++){const idx=Math.min(i*step,buf.length-1);const y=h/2-buf[idx]*(h/2)*0.8;if(i===0)ctx.moveTo(0,y);else ctx.lineTo(i,y);}
  ctx.stroke();
  if(label){ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';ctx.fillText(label,8,14);}
}

function drawBits(bits,canvasId){
  const c=$(canvasId);if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const bw=w/bits.length;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  for(let i=0;i<bits.length;i++){
    const x=i*bw;
    ctx.fillStyle=bits[i]?accent:'#1a1a2e';
    ctx.fillRect(x+1,10,bw-2,h-20);
    ctx.fillStyle='#fff';ctx.font='10px monospace';ctx.textAlign='center';
    ctx.fillText(bits[i].toString(),x+bw/2,h/2+4);
  }
}

function drawFrame(bits,canvasId){
  const c=$(canvasId);if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#050510';ctx.fillRect(0,0,w,h);
  const sections=[
    {label:'PREAMBLE',len:8,color:'#ff6644'},
    {label:'PAYLOAD',len:bits.length-16,color:'#44aaff'},
    {label:'CRC',len:8,color:'#44ff88'}
  ];
  let x=0;
  ctx.font='12px Orbitron,monospace';
  for(const sec of sections){
    const sw=(sec.len/bits.length)*w;
    ctx.fillStyle=sec.color+'33';ctx.fillRect(x,10,sw,h-20);
    ctx.strokeStyle=sec.color;ctx.strokeRect(x,10,sw,h-20);
    ctx.fillStyle=sec.color;ctx.textAlign='center';
    ctx.fillText(sec.label,x+sw/2,h/2);
    ctx.fillStyle='#888';ctx.font='10px monospace';
    ctx.fillText(sec.len+' bits',x+sw/2,h/2+16);
    ctx.font='12px Orbitron,monospace';
    x+=sw;
  }
}

function captureSignal(){
  const proto=$('protoSelect').value;
  const baud=+$('baudSlider').value;
  const noise=+$('noiseSlider').value/100;
  const payloadBits=generateBits(16);
  const crcBits=[];
  const crcVal=crc8(payloadBits);
  for(let i=7;i>=0;i--)crcBits.push((crcVal>>i)&1);
  const allBits=[...PREAMBLE,...payloadBits,...crcBits];
  decodedBits=allBits;
  const sr=16000;
  let sig=encodeBits(allBits,proto,baud,sr);
  sig=addNoise(sig,noise);
  capturedSignal=sig;
  drawSignal(sig,'signalCanvas',proto.toUpperCase()+' @ '+baud+' Bd');
  setStatus(true);
  log(LANG[currentLang].captured+' ('+proto.toUpperCase()+', '+baud+' Bd)','rx');
}

function decodeSignal(){
  if(!decodedBits){log('No captured signal','error');return;}
  drawBits(decodedBits,'bitsCanvas');
  drawFrame(decodedBits,'frameCanvas');
  const proto=$('protoSelect').value;
  const baud=$('baudSlider').value;
  $('detProtoVal').textContent=proto.toUpperCase();
  $('detBaudVal').textContent=baud+' Bd';
  $('preambleVal').textContent=PREAMBLE.join('');
  const payload=decodedBits.slice(8,decodedBits.length-8);
  $('payloadVal').textContent=payload.join('');
  const crcBits=decodedBits.slice(-8);
  $('crcVal').textContent='0x'+parseInt(crcBits.join(''),2).toString(16).toUpperCase().padStart(2,'0');
  log(LANG[currentLang].decoded,'success');
}

function resetProto(){
  capturedSignal=null;decodedBits=null;
  ['signalCanvas','bitsCanvas','frameCanvas'].forEach(id=>{const c=$(id);if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('detProtoVal').textContent='--';$('detBaudVal').textContent='--';
  $('preambleVal').textContent='--';$('payloadVal').textContent='--';$('crcVal').textContent='--';
  setStatus(false);log('Reset','info');
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});
  $('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('captureBtn').onclick=captureSignal;
  $('decodeBtn').onclick=decodeSignal;
  $('resetBtn').onclick=resetProto;
  $('baudSlider').oninput=function(){$('baudVal').textContent=this.value+' Bd';};
  $('noiseSlider').oninput=function(){$('noiseVal').textContent=this.value+'%';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Protocol Reverse
   Animated packet dissection + byte-level protocol view
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const packets=[];
function boot(){
  let el=document.getElementById('protoSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='protoSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function addPacket(){
  const fields=[{label:'SYNC',len:2,color:'#4fc3f7'},{label:'ADDR',len:3,color:'#f59e0b'},
    {label:'TYPE',len:1,color:'#22c55e'},{label:'LEN',len:1,color:'#ec4899'},
    {label:'PAYLOAD',len:4+Math.floor(Math.random()*6),color:'#8b5cf6'},{label:'CRC',len:2,color:'#ef4444'}];
  packets.unshift({fields,y:H*.4,alpha:1,bytes:Array.from({length:16},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0'))});
  if(packets.length>6)packets.pop();
}
function tick(){
  t+=.02;cx.fillStyle='#060810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  if(Math.random()<.02)addPacket();
  packets.forEach((pkt,pi)=>{
    const py=30+pi*24;let px=20;pkt.alpha=Math.max(.2,1-pi*.15);
    pkt.fields.forEach(f=>{
      const fw=f.len*35;
      cx.fillStyle=f.color+'22';cx.fillRect(px,py,fw-2,18);
      cx.strokeStyle=f.color+'66';cx.lineWidth=1;cx.strokeRect(px,py,fw-2,18);
      cx.fillStyle=f.color;cx.font='8px monospace';cx.textAlign='center';
      cx.globalAlpha=pkt.alpha;cx.fillText(f.label,px+fw/2-1,py+13);cx.globalAlpha=1;
      px+=fw;
    });
    // Hex dump on right
    cx.fillStyle=`rgba(200,230,255,${pkt.alpha*.3})`;cx.font='8px monospace';cx.textAlign='left';
    cx.fillText(pkt.bytes.join(' '),px+10,py+13);
  });
  // Animated binary stream at bottom
  cx.fillStyle='rgba(100,200,255,.06)';cx.font='10px monospace';
  for(let i=0;i<60;i++){
    const bx=(i*14-t*40%14+W)%W;
    cx.fillText(Math.random()>.5?'1':'0',bx,H-6);
  }
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Protocol Dissector — Packet Structure',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
