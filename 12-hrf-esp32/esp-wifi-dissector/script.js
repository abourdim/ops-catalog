/**
 * WiFi Dissector — Workshop DIY v1.2
 * 802.11 frame decode with color-coded fields
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'🔬 WiFi Dissector', subtitle:'802.11 Frame Decode',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'802.11 Frame Hex Viewer', mainDesc:'Color-coded 802.11 field decoder',
    sectionA:'Layer-by-Layer Decode', sectionB:'Capture Statistics', sectionC:'802.11 Frame Theory',
    frameType:'Frame type:', generate:'Generate Frame', capture:'Auto Capture',
    theory1:'Every WiFi frame starts with a 2-byte Frame Control field encoding type (management/control/data) and flags (ToDS, FromDS, retry, etc.).',
    theory2:'Up to 4 MAC addresses can appear: receiver, transmitter, BSSID, and source. Which are present depends on ToDS/FromDS bits.',
    theory3:'Management frames (beacons, probes, auth) carry information elements (IEs) with tagged parameters like SSID, supported rates, and channel.',
    theory4:'The 4-byte FCS (CRC-32) at the end protects frame integrity. Frames failing FCS check are silently discarded by hardware.',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    settings:'Settings', language:'Language', theme:'Theme', soundEffects:'Sound effects',
    activityLog:'Activity Log',
    faq_q1:'What is WiFi Dissector?', faq_a1:'An 802.11 frame decoder showing color-coded fields of WiFi packets.',
    faq_q2:'What frame types?', faq_a2:'Beacon, Probe Request, Data, ACK, RTS, Authentication.',
    faq_q3:'Is this real capture?', faq_a3:'No, frames are simulated for learning.',
    howto_1:'Select frame type from dropdown.', howto_2:'Click Generate to create a frame.',
    howto_3:'Hover bytes for field details.', howto_4:'Check Layer Decode section.',
    splashHint:'tap to skip', ready:'🔬 WiFi Dissector ready!',
    langChanged:'Language → English', themeChanged:'Theme →',
    logCleared:'Log cleared', copied:'Copied!',
    frameGenerated:'Frame generated', captureStarted:'Auto capture started', captureStopped:'Auto capture stopped',
  },
  fr: {
    title:'🔬 Dissecteur WiFi', subtitle:'Decodage trame 802.11',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Visualiseur Hex 802.11', mainDesc:'Decodeur de champs 802.11 colore',
    sectionA:'Decodage couche par couche', sectionB:'Statistiques de capture', sectionC:'Theorie trame 802.11',
    frameType:'Type de trame:', generate:'Generer trame', capture:'Capture auto',
    theory1:'Chaque trame WiFi commence par un champ Frame Control de 2 octets encodant le type et les drapeaux.',
    theory2:'Jusqu\'a 4 adresses MAC peuvent apparaitre selon les bits ToDS/FromDS.',
    theory3:'Les trames de gestion transportent des elements d\'information (IE) avec des parametres comme SSID et canal.',
    theory4:'Le FCS 4 octets (CRC-32) protege l\'integrite. Les trames echouant sont rejetees.',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    settings:'Parametres', language:'Langue', theme:'Theme', soundEffects:'Effets sonores',
    activityLog:'Journal',
    faq_q1:'Qu\'est-ce que le Dissecteur WiFi?', faq_a1:'Un decodeur de trames 802.11 avec champs colores.',
    faq_q2:'Quels types de trames?', faq_a2:'Beacon, Probe Request, Data, ACK, RTS, Authentication.',
    faq_q3:'Est-ce une vraie capture?', faq_a3:'Non, les trames sont simulees.',
    howto_1:'Selectionnez le type de trame.', howto_2:'Cliquez Generer.',
    howto_3:'Survolez les octets.', howto_4:'Voir le decodage par couches.',
    splashHint:'appuyer pour passer', ready:'🔬 Dissecteur WiFi pret!',
    langChanged:'Langue → Francais', themeChanged:'Theme →',
    logCleared:'Journal efface', copied:'Copie!',
    frameGenerated:'Trame generee', captureStarted:'Capture auto demarree', captureStopped:'Capture auto arretee',
  },
  ar: {
    title:'🔬 محلل WiFi', subtitle:'فك تشفير إطار 802.11',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'عارض Hex لإطار 802.11', mainDesc:'محلل حقول 802.11 ملون',
    sectionA:'فك التشفير طبقة بطبقة', sectionB:'إحصائيات الالتقاط', sectionC:'نظرية إطار 802.11',
    frameType:'نوع الإطار:', generate:'إنشاء إطار', capture:'التقاط تلقائي',
    theory1:'يبدأ كل إطار WiFi بحقل Frame Control بحجم 2 بايت يشفر النوع والأعلام.',
    theory2:'يمكن أن تظهر حتى 4 عناوين MAC حسب بتات ToDS/FromDS.',
    theory3:'إطارات الإدارة تحمل عناصر معلومات مع معلمات مثل SSID والقناة.',
    theory4:'يحمي FCS بحجم 4 بايت (CRC-32) سلامة الإطار.',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    settings:'الإعدادات', language:'اللغة', theme:'المظهر', soundEffects:'مؤثرات صوتية',
    activityLog:'سجل النشاط',
    faq_q1:'ما هو محلل WiFi؟', faq_a1:'محلل إطارات 802.11 مع حقول ملونة.',
    faq_q2:'ما أنواع الإطارات؟', faq_a2:'Beacon، Probe Request، Data، ACK، RTS، Authentication.',
    faq_q3:'هل هذا التقاط حقيقي؟', faq_a3:'لا، الإطارات محاكاة للتعلم.',
    howto_1:'اختر نوع الإطار.', howto_2:'اضغط إنشاء.',
    howto_3:'مرر فوق البايتات.', howto_4:'راجع قسم فك التشفير.',
    splashHint:'انقر للتخطي', ready:'🔬 محلل WiFi جاهز!',
    langChanged:'اللغة ← العربية', themeChanged:'المظهر ←',
    logCleared:'تم مسح السجل', copied:'تم النسخ!',
    frameGenerated:'تم إنشاء الإطار', captureStarted:'بدأ الالتقاط التلقائي', captureStopped:'توقف الالتقاط التلقائي',
  }
};

/* ═══════ SPLASH ═══════ */
function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);

/* ═══════ CORE ═══════ */
function setLanguage(lang){
  currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});
  localStorage.setItem('dissector-lang',lang);log(LANG[lang]?.langChanged||'Language changed','info');
}
function setTheme(name){
  document.documentElement.setAttribute('data-theme',name);
  if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');
  else document.documentElement.classList.remove('light-theme');
  localStorage.setItem('dissector-theme',name);
}
function log(msg,type='info'){
  const c=$('logContainer');if(!c)return;const line=document.createElement('div');
  line.className='log-line log-'+type;const ts=new Date().toLocaleTimeString();
  line.innerHTML=`<span class="log-ts">${ts}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;
  c.appendChild(line);c.scrollTop=c.scrollHeight;
}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(hideToast,ms)}
function hideToast(){const t=$('toastIndicator');if(t)t.classList.remove('show')}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}

/* ═══════ PANELS ═══════ */
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ 802.11 FRAME SIMULATION ═══════ */
function randByte(){return Math.floor(Math.random()*256)}
function hex(b){return b.toString(16).padStart(2,'0').toUpperCase()}
function randMAC(){return Array.from({length:6},()=>hex(randByte())).join(':')}

const FRAME_DEFS = {
  beacon: {fc:[0x80,0x00],type:'Management',subtype:'Beacon',hasAddr3:true,hasSeq:true,bodyLen:32},
  probe:  {fc:[0x40,0x00],type:'Management',subtype:'Probe Request',hasAddr3:true,hasSeq:true,bodyLen:16},
  data:   {fc:[0x08,0x01],type:'Data',subtype:'Data',hasAddr3:true,hasSeq:true,bodyLen:48},
  ack:    {fc:[0xD4,0x00],type:'Control',subtype:'ACK',hasAddr3:false,hasSeq:false,bodyLen:0},
  rts:    {fc:[0xB4,0x00],type:'Control',subtype:'RTS',hasAddr3:false,hasSeq:false,bodyLen:0},
  auth:   {fc:[0xB0,0x00],type:'Management',subtype:'Authentication',hasAddr3:true,hasSeq:true,bodyLen:6},
};

let currentFrame = null;
let captureStats = {beacon:0,probe:0,data:0,ack:0,rts:0,auth:0};
let captureInterval = null;

function generateFrame(type){
  const def = FRAME_DEFS[type];
  const frame = {type, def, bytes:[], fields:[]};
  let offset = 0;

  // Frame Control (2 bytes)
  frame.bytes.push(def.fc[0], def.fc[1]);
  frame.fields.push({name:'Frame Control',cls:'f-fc',start:offset,len:2,
    detail:`Type: ${def.type}, Subtype: ${def.subtype}, FC: 0x${hex(def.fc[0])}${hex(def.fc[1])}`});
  offset+=2;

  // Duration (2 bytes)
  const dur = randByte() & 0x7F;
  frame.bytes.push(dur, 0x00);
  frame.fields.push({name:'Duration/ID',cls:'f-dur',start:offset,len:2,detail:`Duration: ${dur} microseconds`});
  offset+=2;

  // Address 1 - Receiver (6 bytes)
  const addr1 = Array.from({length:6},()=>randByte());
  frame.bytes.push(...addr1);
  frame.fields.push({name:'Address 1 (RA)',cls:'f-addr1',start:offset,len:6,detail:`Receiver: ${addr1.map(hex).join(':')}`});
  offset+=6;

  if(type !== 'ack'){
    // Address 2 - Transmitter (6 bytes)
    const addr2 = Array.from({length:6},()=>randByte());
    frame.bytes.push(...addr2);
    frame.fields.push({name:'Address 2 (TA)',cls:'f-addr2',start:offset,len:6,detail:`Transmitter: ${addr2.map(hex).join(':')}`});
    offset+=6;
  }

  if(def.hasAddr3){
    // Address 3 - BSSID (6 bytes)
    const addr3 = Array.from({length:6},()=>randByte());
    frame.bytes.push(...addr3);
    frame.fields.push({name:'Address 3 (BSSID)',cls:'f-addr3',start:offset,len:6,detail:`BSSID: ${addr3.map(hex).join(':')}`});
    offset+=6;
  }

  if(def.hasSeq){
    // Sequence Control (2 bytes)
    const seq = Math.floor(Math.random()*4096);
    const frag = 0;
    frame.bytes.push((seq<<4|frag)&0xFF, (seq>>4)&0xFF);
    frame.fields.push({name:'Sequence Control',cls:'f-seq',start:offset,len:2,detail:`Seq#: ${seq}, Frag#: ${frag}`});
    offset+=2;
  }

  if(def.bodyLen > 0){
    const body = Array.from({length:def.bodyLen},()=>randByte());
    frame.bytes.push(...body);
    frame.fields.push({name:'Frame Body',cls:'f-body',start:offset,len:def.bodyLen,detail:`Payload: ${def.bodyLen} bytes`});
    offset+=def.bodyLen;
  }

  // FCS (4 bytes) - simulated CRC
  const fcs = Array.from({length:4},()=>randByte());
  frame.bytes.push(...fcs);
  frame.fields.push({name:'FCS (CRC-32)',cls:'f-fcs',start:offset,len:4,detail:`FCS: 0x${fcs.map(hex).join('')}`});

  currentFrame = frame;
  captureStats[type]++;
  renderHex();
  renderDecode();
  drawStats();
  log(`${LANG[currentLang]?.frameGenerated||'Frame generated'}: ${def.subtype} (${frame.bytes.length} bytes)`, 'success');
  playSound('click');
}

function renderHex(){
  const el = $('hexDisplay');
  if(!el || !currentFrame) return;
  let html = '';
  const fieldMap = [];
  currentFrame.fields.forEach(f=>{
    for(let i=f.start;i<f.start+f.len;i++) fieldMap[i] = f;
  });
  currentFrame.bytes.forEach((b,i)=>{
    const f = fieldMap[i];
    const cls = f ? f.cls : '';
    const title = f ? `${f.name}: ${f.detail}` : '';
    html += `<span class="hex-byte ${cls}" title="${title}">${hex(b)}</span>`;
    if((i+1)%16===0) html += '<br>';
  });
  el.innerHTML = html;
}

function renderDecode(){
  const el = $('decodePanel');
  if(!el || !currentFrame) return;
  let html = `<div class="decode-row"><div class="decode-label">Frame Type</div><div>${currentFrame.def.type} / ${currentFrame.def.subtype}</div></div>`;
  html += `<div class="decode-row"><div class="decode-label">Total Length</div><div>${currentFrame.bytes.length} bytes</div></div>`;
  currentFrame.fields.forEach(f=>{
    const bytes = currentFrame.bytes.slice(f.start, f.start+f.len).map(hex).join(' ');
    html += `<div class="decode-row"><div class="decode-label">${f.name}</div><div>${f.detail}<br><span style="opacity:.5;font-size:.85em">[${bytes}]</span></div></div>`;
  });
  // Decode Frame Control bits
  const fc0 = currentFrame.bytes[0], fc1 = currentFrame.bytes[1];
  const protVer = fc0 & 0x03;
  const ftype = (fc0 >> 2) & 0x03;
  const fsub = (fc0 >> 4) & 0x0F;
  const toDS = fc1 & 0x01;
  const fromDS = (fc1 >> 1) & 0x01;
  const retry = (fc1 >> 3) & 0x01;
  html += `<div class="decode-row" style="margin-top:8px;border-top:2px solid var(--accent)"><div class="decode-label">FC Bits Detail</div><div>Protocol: ${protVer}, Type: ${ftype}, Subtype: ${fsub}, ToDS: ${toDS}, FromDS: ${fromDS}, Retry: ${retry}</div></div>`;
  el.innerHTML = html;
}

function drawStats(){
  const canvas = $('statsCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,W,H);
  const types = Object.keys(captureStats);
  const colors = ['#e63946','#457b9d','#2a9d8f','#e9c46a','#f4a261','#6a0572'];
  const max = Math.max(1, ...Object.values(captureStats));
  const bw = W / types.length - 20;
  types.forEach((t,i)=>{
    const x = i * (bw+20) + 20;
    const h = (captureStats[t]/max) * (H-50);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, H-30-h, bw, h);
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.font = '11px Orbitron,monospace';
    ctx.fillText(t, x, H-14);
    ctx.fillText(captureStats[t]+'', x+bw/2-5, H-34-h);
  });
  const info = $('statsInfo');
  if(info){
    const total = Object.values(captureStats).reduce((a,b)=>a+b,0);
    info.textContent = `Total frames: ${total}`;
  }
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang = localStorage.getItem('dissector-lang')||'en';
  const savedTheme = localStorage.getItem('dissector-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',()=>openPanel('helpPanel','helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('helpOverlay')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('settingsBtn')?.addEventListener('click',()=>openPanel('settingsPanel','settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('logBtn')?.addEventListener('click',()=>$('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click',()=>$('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked});
  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log(LANG[currentLang]?.logCleared||'Cleared','info')});
  $('copyLogBtn')?.addEventListener('click',()=>{navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast(LANG[currentLang]?.copied||'Copied',1500))});

  // Help tabs
  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      const map={faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'};
      $(map[tab.dataset.tab])?.classList.add('active');
    });
  });

  // Log filters
  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');const f=btn.dataset.filter;
      document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none'});
    });
  });

  // Frame generation
  $('generateBtn')?.addEventListener('click',()=>{
    const type = $('frameTypeSelect')?.value || 'beacon';
    generateFrame(type);
  });

  // Auto capture
  $('captureBtn')?.addEventListener('click',()=>{
    if(captureInterval){
      clearInterval(captureInterval);captureInterval=null;
      setStatus(false);
      $('captureBtn').textContent = LANG[currentLang]?.capture || 'Auto Capture';
      log(LANG[currentLang]?.captureStopped||'Auto capture stopped','info');
    } else {
      captureInterval = setInterval(()=>{
        const types = Object.keys(FRAME_DEFS);
        const weights = [30,15,40,10,3,2]; // beacon heavy, data heavy
        const total = weights.reduce((a,b)=>a+b,0);
        let r = Math.random()*total, idx=0;
        for(let i=0;i<weights.length;i++){r-=weights[i];if(r<=0){idx=i;break}}
        generateFrame(types[idx]);
      },1200);
      setStatus(true);
      $('captureBtn').textContent = 'Stop';
      log(LANG[currentLang]?.captureStarted||'Auto capture started','success');
    }
  });

  // Initial frame
  generateFrame('beacon');
  setStatus(false);
  log(LANG[currentLang]?.ready||'Ready','success');
});
