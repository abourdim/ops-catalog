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
    howto_1:'Select frame type from dropdown.', howto_2:'Click Generate to create a frame.',
    howto_3:'Hover bytes for field details.', howto_4:'Check Layer Decode section.',
    splashHint:'tap to skip', ready:'🔬 WiFi Dissector ready!',
    langChanged:'Language → English', themeChanged:'Theme →',
    logCleared:'Log cleared', copied:'Copied!',
    frameGenerated:'Frame generated', captureStarted:'Auto capture started', captureStopped:'Auto capture stopped',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need ESP32. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Esp Lora Lab and Esp Rf Iot Audit! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
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
    howto_1:'Selectionnez le type de trame.', howto_2:'Cliquez Generer.',
    howto_3:'Survolez les octets.', howto_4:'Voir le decodage par couches.',
    splashHint:'appuyer pour passer', ready:'🔬 Dissecteur WiFi pret!',
    langChanged:'Langue → Francais', themeChanged:'Theme →',
    logCleared:'Journal efface', copied:'Copie!',
    frameGenerated:'Trame generee', captureStarted:'Capture auto demarree', captureStopped:'Capture auto arretee',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut ESP32. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Lora Lab and Esp Rf Iot Audit ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
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
    howto_1:'اختر نوع الإطار.', howto_2:'اضغط إنشاء.',
    howto_3:'مرر فوق البايتات.', howto_4:'راجع قسم فك التشفير.',
    splashHint:'انقر للتخطي', ready:'🔬 محلل WiFi جاهز!',
    langChanged:'اللغة ← العربية', themeChanged:'المظهر ←',
    logCleared:'تم مسح السجل', copied:'تم النسخ!',
    frameGenerated:'تم إنشاء الإطار', captureStarted:'بدأ الالتقاط التلقائي', captureStopped:'توقف الالتقاط التلقائي',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج ESP32. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Lora Lab and Esp Rf Iot Audit! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
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

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — WiFi Dissector: 802.11 frame visualization
   with color-coded fields, hex bytes, and frame flow animation
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simDissectorCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const wifiFrames=[],hexDrops=[];let captureCount=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  const FRAME_TYPES=[
    {name:'Beacon',color:'#4d96ff',fields:['FC','Dur','BSSID','SA','DA','Seq','SSID','Rates','CH','FCS']},
    {name:'Probe Req',color:'#ffd93d',fields:['FC','Dur','DA','SA','BSSID','Seq','SSID','FCS']},
    {name:'Data',color:'#6bcb77',fields:['FC','Dur','Addr1','Addr2','Addr3','Seq','Payload','FCS']},
    {name:'ACK',color:'#ff78ae',fields:['FC','Dur','RA','FCS']},
    {name:'Auth',color:'#e879f9',fields:['FC','Dur','DA','SA','BSSID','Seq','AuthAlg','Status','FCS']},
    {name:'RTS',color:'#ff6b6b',fields:['FC','Dur','RA','TA','FCS']}
  ];

  class WiFiFrame{
    constructor(){
      this.type=FRAME_TYPES[Math.floor(Math.random()*FRAME_TYPES.length)];
      this.x=-50;this.y=30+Math.random()*(H-100);this.vx=1+Math.random()*1.5;
      this.alive=true;this.fieldWidth=Math.max(16,Math.floor((W-100)/this.type.fields.length));
      this.hex=Array.from({length:this.type.fields.length*2},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0'));
    }
    update(){this.x+=this.vx;if(this.x>W+100)this.alive=false;return this.alive;}
    draw(){
      const fh=20,totalW=this.type.fields.length*this.fieldWidth;
      // Frame background
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(this.x,this.y,totalW,fh+14);
      // Type label
      ctx.font='bold 8px monospace';ctx.fillStyle=this.type.color;ctx.textAlign='left';ctx.fillText(this.type.name,this.x,this.y-4);
      // Fields
      this.type.fields.forEach((f,i)=>{
        const fx=this.x+i*this.fieldWidth;
        ctx.fillStyle=this.type.color+'33';ctx.fillRect(fx,this.y,this.fieldWidth-2,fh);
        ctx.strokeStyle=this.type.color+'66';ctx.lineWidth=1;ctx.strokeRect(fx,this.y,this.fieldWidth-2,fh);
        ctx.font='7px monospace';ctx.fillStyle=this.type.color;ctx.textAlign='center';ctx.fillText(f,fx+this.fieldWidth/2-1,this.y+8);
        // Hex bytes below
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='6px monospace';
        const hexStr=this.hex[i*2]||'00';ctx.fillText(hexStr,fx+this.fieldWidth/2-1,this.y+fh+8);
      });
    }
  }

  /* Hex rain background */
  class HexDrop{
    constructor(){this.x=Math.random()*W;this.y=-10;this.speed=0.5+Math.random()*1;this.char=Math.floor(Math.random()*256).toString(16).padStart(2,'0');}
    update(){this.y+=this.speed;if(this.y>H){this.y=-10;this.x=Math.random()*W;this.char=Math.floor(Math.random()*256).toString(16).padStart(2,'0');}return true;}
    draw(){ctx.font='8px monospace';ctx.fillStyle='rgba(100,150,255,0.06)';ctx.textAlign='center';ctx.fillText(this.char,this.x,this.y);}
  }

  /* Frame type histogram */
  function drawHistogram(){
    const counts={};FRAME_TYPES.forEach(t=>counts[t.name]=0);wifiFrames.forEach(f=>counts[f.type.name]++);
    const bw=Math.min(50,(W-40)/FRAME_TYPES.length-6),sx=(W-FRAME_TYPES.length*(bw+6))/2;
    const by=H-8;
    FRAME_TYPES.forEach((t,i)=>{
      const bx=sx+i*(bw+6),bh=Math.min(30,counts[t.name]*4);
      ctx.fillStyle=t.color+'44';ctx.fillRect(bx,by-bh,bw,bh);ctx.strokeStyle=t.color;ctx.lineWidth=1;ctx.strokeRect(bx,by-bh,bw,bh);
      ctx.font='6px monospace';ctx.fillStyle=t.color;ctx.textAlign='center';ctx.fillText(t.name.slice(0,6),bx+bw/2,by+6);
    });
  }

  /* Protocol control field decoder */
  function drawFCDecoder(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(W-140,8,132,44);ctx.strokeStyle='#fff2';ctx.strokeRect(W-140,8,132,44);
    ctx.font='8px monospace';ctx.fillStyle='#4d96ff';ctx.textAlign='left';ctx.fillText('Frame Control Bits',W-134,20);
    const bits=['ToDS','FromDS','Retry','PwrMgt','More','WEP','Order','Prot'];
    bits.forEach((b,i)=>{const on=Math.random()>0.5;ctx.fillStyle=on?'#6bcb77':'#444';ctx.fillText((on?'1':'0')+' '+b,W-134+(i%4)*33,32+(Math.floor(i/4)*12));});
    ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,56);ctx.strokeStyle='#4d96ff33';ctx.strokeRect(8,8,185,56);
    ctx.font='10px monospace';ctx.fillStyle='#4d96ff';ctx.textAlign='left';ctx.fillText('\u{1F52C} WIFI DISSECTOR',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Frames: '+captureCount+'  Active: '+wifiFrames.length,16,40);
    ctx.fillText('Types: '+FRAME_TYPES.length,16,54);ctx.restore();
  }

  function init(){
    ensureCanvas();
    for(let i=0;i<60;i++)hexDrops.push(new HexDrop());
    animate();
  }
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,16,0.14)';ctx.fillRect(0,0,W,H);
    hexDrops.forEach(d=>{d.update();d.draw();});
    if(frameCount%30===0){wifiFrames.push(new WiFiFrame());captureCount++;}
    for(let i=wifiFrames.length-1;i>=0;i--){if(!wifiFrames[i].update())wifiFrames.splice(i,1);else wifiFrames[i].draw();}
    drawHistogram();if(frameCount%60<30)drawFCDecoder();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
})();


// ── Code Tab Switching ──
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('code-tab')) {
    var tabs = e.target.parentElement;
    tabs.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
    e.target.classList.add('active');
    var target = e.target.getAttribute('data-codetarget');
    var card = tabs.closest('.card');
    card.querySelectorAll('.code-display').forEach(function(d) { d.classList.add('hidden'); });
    var show = card.querySelector('#code-' + target);
    if (show) show.classList.remove('hidden');
  }
});

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}
