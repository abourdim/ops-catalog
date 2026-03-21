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

/* === MORSE CODE EASTER EGG === */
function initMorseEasterEgg(){
 if(document.getElementById('morseHint'))return;
 var MORSE_MAP={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z'};
 var morseSeq=[];var morseTimer=null;var keyDownTime=0;
 var hint=document.createElement('span');hint.id='morseHint';hint.textContent='|';hint.title='Morse';hint.style.cssText='opacity:0.3;cursor:default;font-size:0.7rem;margin:0 4px;';
 var footer=document.querySelector('footer')||document.querySelector('.footer');
 if(footer)footer.appendChild(hint);
 function decodeMorse(){
  var letters=[];var current='';
  for(var i=0;i<morseSeq.length;i++){
   if(morseSeq[i]===' '){if(current){letters.push(MORSE_MAP[current]||'?');current='';}}
   else{current+=morseSeq[i];}
  }
  if(current)letters.push(MORSE_MAP[current]||'?');
  var word=letters.join('');
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  if(word==='SOS'){
   var flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:white;z-index:999999;opacity:0.8;transition:opacity 0.5s;';
   document.body.appendChild(flash);setTimeout(function(){flash.style.opacity='0';setTimeout(function(){flash.remove();},500);},200);
   var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
   var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:420px;width:90%;color:var(--text,#e4ddd0);text-align:center;';
   box.innerHTML='<h3 style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;">'+((L.morseSecret)||'Morse Easter Egg')+'</h3><p style="margin:1rem 0;font-style:italic;line-height:1.6;">'+((L.morseBackstory)||'Origin unknown.')+'</p><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);
  }else if(word==='HELP'){
   var helpBtn=document.querySelector('[data-panel="help"]')||document.querySelector('.btn-help')||document.querySelector('[title="Help"]');
   if(helpBtn)helpBtn.click();
  }
  if(word.length>0){console.log((L.morseDecoded||'Decoded: ')+word);}
  morseSeq=[];
 }
 document.addEventListener('keydown',function(e){
  if(e.code!=='Space'||e.repeat||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  e.preventDefault();keyDownTime=Date.now();if(morseTimer)clearTimeout(morseTimer);
 });
 document.addEventListener('keyup',function(e){
  if(e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  var dur=Date.now()-keyDownTime;
  morseSeq.push(dur<200?'.':'-');
  if(morseTimer)clearTimeout(morseTimer);
  morseTimer=setTimeout(function(){morseSeq.push(' ');morseTimer=setTimeout(decodeMorse,1000);},300);
 });
}

/* === DNA FINGERPRINT VISUALIZER === */
function initDNAFingerprint(){
 if(document.getElementById('dnaBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var dnaBtn=document.createElement('button');dnaBtn.id='dnaBtn';dnaBtn.className='btn-icon-only';
 dnaBtn.textContent='\uD83E\uDDEC';dnaBtn.title=L.dnaTitle||'DNA Fingerprint';dnaBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(dnaBtn);else{dnaBtn.style.cssText+='position:fixed;top:0.5rem;right:6rem;z-index:9999;';document.body.appendChild(dnaBtn);}
 var panel=null;var canvas=null;var animId=null;
 function getSliderHues(){
  var sliders=document.querySelectorAll('input[type="range"]');var hues=[];
  sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);var ratio=(val-min)/(max-min||1);hues.push(Math.round(ratio*360));});
  if(hues.length===0)hues=[0,120,240];return hues;
 }
 function drawDNA(){
  if(!canvas)return;var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;
  ctx.clearRect(0,0,w,h);var hues=getSliderHues();var t=Date.now()/1000;
  for(var x=0;x<w;x+=4){
   var phase=x/w*Math.PI*4+t;var y1=h/2+Math.sin(phase)*25;var y2=h/2+Math.sin(phase+Math.PI)*25;
   var hIdx=Math.floor((x/w)*hues.length)%hues.length;var hue=hues[hIdx]||0;
   ctx.beginPath();ctx.arc(x,y1,2,0,Math.PI*2);ctx.fillStyle='hsl('+hue+',80%,60%)';ctx.fill();
   ctx.beginPath();ctx.arc(x,y2,2,0,Math.PI*2);ctx.fillStyle='hsl('+(hue+180)%360+',80%,60%)';ctx.fill();
   if(x%12<4){ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='hsla('+hue+',60%,50%,0.3)';ctx.lineWidth=1;ctx.stroke();}
  }
  animId=requestAnimationFrame(drawDNA);
 }
 dnaBtn.onclick=function(){
  if(panel){panel.remove();panel=null;if(animId)cancelAnimationFrame(animId);return;}
  panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:80px;right:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;text-align:center;';
  panel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:6px;">'+(L.dnaTitle||'DNA Fingerprint')+'</div>';
  canvas=document.createElement('canvas');canvas.width=200;canvas.height=80;canvas.style.cssText='border-radius:8px;background:rgba(0,0,0,0.3);display:block;';
  panel.appendChild(canvas);
  var saveBtn=document.createElement('button');saveBtn.textContent=L.dnaSave||'Save DNA';
  saveBtn.style.cssText='margin-top:8px;background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;';
  saveBtn.onclick=function(){var link=document.createElement('a');link.download='dna-fingerprint.png';link.href=canvas.toDataURL();link.click();};
  panel.appendChild(saveBtn);
  var info=document.createElement('div');info.style.cssText='color:var(--text,#e4ddd0);font-size:0.65rem;opacity:0.7;margin-top:4px;';info.textContent=L.dnaInfo||'Unique visual signature';
  panel.appendChild(info);document.body.appendChild(panel);drawDNA();
 };
}

/* === SANDBOX MODE === */
function initSandboxMode(){
 if(document.getElementById('sandboxBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var active=false;var originals=[];var customCount=0;
 var sandboxBtn=document.createElement('button');sandboxBtn.id='sandboxBtn';sandboxBtn.className='btn-icon-only';
 sandboxBtn.textContent='\uD83D\uDD27';sandboxBtn.title=L.sandboxTitle||'Sandbox Mode';sandboxBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(sandboxBtn);else{sandboxBtn.style.cssText+='position:fixed;top:0.5rem;right:9rem;z-index:9999;';document.body.appendChild(sandboxBtn);}
 var controlPanel=null;
 function storeOriginals(){
  originals=[];document.querySelectorAll('input[type="range"]').forEach(function(s){
   originals.push({el:s,min:s.min,max:s.max,val:s.value,step:s.step});
  });
 }
 function unlockSliders(){
  document.querySelectorAll('input[type="range"]').forEach(function(s){s.min='0';s.max='100';});
 }
 function restoreSliders(){
  originals.forEach(function(o){o.el.min=o.min;o.el.max=o.max;o.el.value=o.val;o.el.step=o.step;o.el.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function addCustomSlider(){
  customCount++;
  var name=prompt('Parameter name:','Custom-'+customCount);if(!name)return;
  var wrap=document.createElement('div');wrap.className='sandbox-custom-slider';wrap.style.cssText='margin:8px 0;padding:6px;background:rgba(0,0,0,0.2);border-radius:8px;';
  var lbl=document.createElement('label');lbl.textContent=name;lbl.style.cssText='color:var(--accent,#d4a03c);font-size:0.75rem;display:block;';
  var sl=document.createElement('input');sl.type='range';sl.min='0';sl.max='100';sl.value='50';sl.style.cssText='width:100%;';
  var valSpan=document.createElement('span');valSpan.textContent='50';valSpan.style.cssText='color:var(--text,#e4ddd0);font-size:0.7rem;';
  sl.oninput=function(){valSpan.textContent=sl.value;console.log('[Sandbox] '+name+': '+sl.value);};
  wrap.appendChild(lbl);wrap.appendChild(sl);wrap.appendChild(valSpan);
  if(controlPanel)controlPanel.appendChild(wrap);
 }
 sandboxBtn.onclick=function(){
  active=!active;
  if(active){
   sandboxBtn.style.background='var(--accent,#d4a03c)';sandboxBtn.style.color='#000';sandboxBtn.style.borderRadius='6px';
   storeOriginals();unlockSliders();
   controlPanel=document.createElement('div');controlPanel.id='sandboxPanel';
   controlPanel.style.cssText='position:fixed;bottom:80px;left:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;min-width:200px;max-height:300px;overflow-y:auto;';
   controlPanel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:8px;">'+(L.sandboxOn||'Sandbox ON')+'</div>';
   var addBtn=document.createElement('button');addBtn.textContent=L.sandboxAdd||'Add Parameter';
   addBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:700;margin-right:6px;';
   addBtn.onclick=addCustomSlider;
   var resetBtn=document.createElement('button');resetBtn.textContent=L.sandboxReset||'Reset Defaults';
   resetBtn.style.cssText='background:transparent;color:var(--accent,#d4a03c);border:1px solid var(--accent,#d4a03c);padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;';
   resetBtn.onclick=function(){restoreSliders();};
   controlPanel.appendChild(addBtn);controlPanel.appendChild(resetBtn);document.body.appendChild(controlPanel);
  }else{
   sandboxBtn.style.background='';sandboxBtn.style.color='';sandboxBtn.style.borderRadius='';
   restoreSliders();
   if(controlPanel){controlPanel.remove();controlPanel=null;}
   document.querySelectorAll('.sandbox-custom-slider').forEach(function(el){el.remove();});
  }
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initMorseEasterEgg();}catch(e){console.warn('Morse init:',e);}try{initDNAFingerprint();}catch(e){console.warn('DNA init:',e);}try{initSandboxMode();}catch(e){console.warn('Sandbox init:',e);}});



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
