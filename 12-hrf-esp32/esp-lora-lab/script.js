/**
 * LoRa Lab — Workshop DIY v1.2
 * ESP32 LoRa chirp spread spectrum simulator
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.4-2.4c-2.6-1.8-3.9-2.6-6.4-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9z"/></svg>`;
const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch(type) {
    case 'click': osc.frequency.value=800; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.08); osc.start(t); osc.stop(t+0.08); break;
    case 'success': osc.frequency.value=523; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.3); osc.start(t); osc.stop(t+0.3); break;
    case 'error': osc.frequency.value=200; osc.type='square'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.25); osc.start(t); osc.stop(t+0.25); break;
  }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: '📶 LoRa Lab', subtitle: 'Long Range Radio — Chirp Spread Spectrum',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Chirp Spread Spectrum Waterfall', mainDesc: 'ESP32 LoRa sends km range, see chirp spectrum',
    sectionA: 'Range Calculator — Distance vs Power', sectionB: 'LoRa Message Log', sectionC: 'LoRa Theory — How Chirps Work',
    sfLabel: 'Spreading Factor:', bwLabel: 'BW:', txPower: 'TX Power:',
    sendBtn: '📡 Send', estRange: 'Est. Range:', dataRate: 'Rate:', airtime: 'Airtime:',
    theory1: 'LoRa uses Chirp Spread Spectrum (CSS) modulation. Each symbol is a frequency sweep (chirp) across the entire bandwidth.',
    theory2: 'Higher Spreading Factors (SF7-SF12) trade data rate for range. SF12 is 64x slower than SF7 but reaches much farther.',
    theory3: 'The waterfall shows how chirps sweep from low to high frequency. Each starting frequency encodes a different symbol value.',
    theory4: 'Link budget: LoRa achieves -137 dBm sensitivity at SF12/125kHz, enabling 15+ km range in open terrain.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '⚙️ Settings', language: 'Language', theme: 'Theme',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is LoRa Lab?', faq_a1: 'A simulator for LoRa long-range radio using chirp spread spectrum on ESP32.',
    faq_q2: 'What is Spreading Factor?', faq_a2: 'SF controls range vs data rate. SF12 = max range, SF7 = max speed.',
    faq_q3: 'How far can LoRa reach?', faq_a3: '15+ km in open terrain with SF12/20dBm.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser.',
    howto_1: 'Select SF and bandwidth from controls.',
    howto_2: 'Type a message and press Send.',
    howto_3: 'Watch chirps on the waterfall display.',
    howto_4: 'Open Range Calculator to compare SF distances.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 built-in themes.',
    wiki_i18n_title: '🌐 Languages', wiki_i18n: 'EN/FR/AR with RTL.',
    wiki_log_title: '📜 Activity Log', wiki_log: 'TX/RX event log.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy: '100% local simulation.',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', ready: '📶 LoRa Lab ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    msgSent: 'Message sent via LoRa', chirpAnim: 'Chirp animation active',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
  },
  fr: {
    title: '📶 Labo LoRa', subtitle: 'Radio Longue Portee — Spectre Chirp',
    disconnected: 'Deconnecte', connected: 'Connecte',
    mainSection: 'Cascade Chirp Spread Spectrum', mainDesc: 'ESP32 LoRa envoie a des km, voir le spectre chirp',
    sectionA: 'Calculateur de portee — Distance vs Puissance', sectionB: 'Journal Messages LoRa', sectionC: 'Theorie LoRa — Fonctionnement des chirps',
    sfLabel: 'Facteur d\'etalement:', bwLabel: 'BP:', txPower: 'Puissance TX:',
    sendBtn: '📡 Envoyer', estRange: 'Portee est.:', dataRate: 'Debit:', airtime: 'Temps air:',
    theory1: 'LoRa utilise la modulation CSS (Chirp Spread Spectrum). Chaque symbole est un balayage de frequence sur toute la bande.',
    theory2: 'Les facteurs d\'etalement plus eleves (SF7-SF12) echangent le debit contre la portee.',
    theory3: 'La cascade montre comment les chirps balayent de basse a haute frequence.',
    theory4: 'Bilan de liaison: LoRa atteint -137 dBm de sensibilite a SF12/125kHz, permettant 15+ km.',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '⚙️ Parametres', language: 'Langue', theme: 'Theme',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que Labo LoRa?', faq_a1: 'Un simulateur radio LoRa longue portee avec spectre chirp sur ESP32.',
    faq_q2: 'Qu\'est-ce que le facteur d\'etalement?', faq_a2: 'SF controle portee vs debit. SF12 = portee max.',
    faq_q3: 'Quelle portee pour LoRa?', faq_a3: '15+ km en terrain ouvert avec SF12/20dBm.',
    faq_q4: 'Mes donnees sont privees?', faq_a4: 'Oui. Tout fonctionne localement.',
    howto_1: 'Selectionnez SF et bande passante.', howto_2: 'Tapez un message et appuyez Envoyer.',
    howto_3: 'Observez les chirps sur la cascade.', howto_4: 'Ouvrez le calculateur de portee.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 themes integres.',
    wiki_i18n_title: '🌐 Langues', wiki_i18n: 'EN/FR/AR avec RTL.',
    wiki_log_title: '📜 Journal', wiki_log: 'Journal TX/RX.',
    wiki_privacy_title: '🔒 Confidentialite', wiki_privacy: 'Simulation 100% locale.',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Reactif musique',
    splashHint: 'appuyer pour passer', ready: '📶 Labo LoRa pret!',
    logCleared: 'Journal efface', copied: 'Copie!', copyFail: 'Echec',
    working: 'En cours…', langChanged: '🌐 Langue → Francais', themeChanged: '🎨 Theme →',
    msgSent: 'Message envoye via LoRa',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
  },
  ar: {
    title: '📶 مختبر LoRa', subtitle: 'راديو بعيد المدى — طيف Chirp',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'شلال طيف Chirp المنتشر', mainDesc: 'ESP32 LoRa يرسل لمسافات كيلومترات',
    sectionA: 'حاسبة المدى — المسافة مقابل القوة', sectionB: 'سجل رسائل LoRa', sectionC: 'نظرية LoRa — كيف تعمل Chirps',
    sfLabel: 'عامل الانتشار:', bwLabel: 'عرض النطاق:', txPower: 'قوة الإرسال:',
    sendBtn: '📡 إرسال', estRange: 'المدى المقدر:', dataRate: 'المعدل:', airtime: 'وقت البث:',
    theory1: 'يستخدم LoRa تعديل CSS. كل رمز هو مسح تردد عبر كامل عرض النطاق.',
    theory2: 'عوامل الانتشار الأعلى تستبدل معدل البيانات بالمدى.',
    theory3: 'يُظهر الشلال كيف تمسح chirps من تردد منخفض إلى عالٍ.',
    theory4: 'ميزانية الربط: يحقق LoRa حساسية -137 dBm عند SF12/125kHz، مما يتيح مدى 15+ كم.',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    settings: '⚙️ الإعدادات', language: 'اللغة', theme: 'المظهر',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هو مختبر LoRa؟', faq_a1: 'محاكي لراديو LoRa بعيد المدى بطيف chirp على ESP32.',
    faq_q2: 'ما هو عامل الانتشار؟', faq_a2: 'SF يتحكم في المدى مقابل المعدل.',
    faq_q3: 'ما مدى وصول LoRa؟', faq_a3: '15+ كم في التضاريس المفتوحة.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محلياً.',
    howto_1: 'اختر SF وعرض النطاق.', howto_2: 'اكتب رسالة واضغط إرسال.',
    howto_3: 'شاهد chirps على شاشة الشلال.', howto_4: 'افتح حاسبة المدى.',
    wiki_themes_title: '🎨 المظاهر', wiki_themes: '8 مظاهر مدمجة.',
    wiki_i18n_title: '🌐 اللغات', wiki_i18n: 'EN/FR/AR مع RTL.',
    wiki_log_title: '📜 سجل النشاط', wiki_log: 'سجل أحداث TX/RX.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'محاكاة محلية 100%.',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس',
    breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    splashHint: 'انقر للتخطي', ready: '📶 مختبر LoRa جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    working: 'جارٍ…', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    msgSent: 'تم إرسال الرسالة عبر LoRa',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
  }
};

let currentLang = 'en';

/* ═══════ THEME MELODIES ═══════ */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],zellige:[440,523,659],andalus:[294,370,440],
  space:[523,659,784],jungle:[262,330,392],robot:[440,554,659],
  riad:[349,440,523],medina:[294,349,440],retro:[523,262,523]
};
function playThemeMelody(name){
  if(!soundEnabled)return; if(!audioCtx)audioCtx=new AudioCtx();
  const notes=THEME_MELODIES[name]||THEME_MELODIES['mosque-gold'];
  notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;o.type='sine';
    g.gain.value=0.06;const t=audioCtx.currentTime+i*0.15;
    g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);});
}

/* ═══════ SPLASH ═══════ */
function dismissSplash(){const s=$('splash');if(s)s.style.opacity='0';setTimeout(()=>{if(s)s.style.display='none'},500);}
setTimeout(dismissSplash,3000);

/* ═══════ i18n ENGINE ═══════ */
function setLanguage(lang){
  currentLang=lang;
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(LANG[lang]&&LANG[lang][k])el.textContent=LANG[lang][k];
  });
  localStorage.setItem('lora-lang',lang);
  log(LANG[lang]?.langChanged||'Language changed','info');
}

/* ═══════ THEME ENGINE ═══════ */
function setTheme(name){
  document.documentElement.setAttribute('data-theme',name);
  if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');
  else document.documentElement.classList.remove('light-theme');
  localStorage.setItem('lora-theme',name);
  playThemeMelody(name);
  log((LANG[currentLang]?.themeChanged||'Theme →')+' '+name,'info');
}

/* ═══════ LOG ═══════ */
function log(msg,type='info'){
  const c=$('logContainer'); if(!c)return;
  const line=document.createElement('div');
  line.className='log-line log-'+type;
  const ts=new Date().toLocaleTimeString();
  line.innerHTML=`<span class="log-ts">${ts}</span> <span class="log-badge">${type.toUpperCase()}</span> ${msg}`;
  c.appendChild(line); c.scrollTop=c.scrollHeight;
}

/* ═══════ TOAST ═══════ */
function showToast(msg,ms){
  const t=$('toastIndicator'),m=$('toastMessage');
  if(m)m.textContent=msg; if(t)t.classList.add('show');
  if(ms)setTimeout(hideToast,ms);
}
function hideToast(){const t=$('toastIndicator');if(t)t.classList.remove('show');}

/* ═══════ STATUS ═══════ */
function setStatus(on){
  const d=$('statusDot'),t=$('statusText');
  if(d){d.style.background=on?'#0f0':'#f44';}
  if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||'';
}

/* ═══════ PANELS ═══════ */
function openHelp(){$('helpPanel')?.classList.add('open');$('helpOverlay')?.classList.add('show');}
function closeHelp(){$('helpPanel')?.classList.remove('open');$('helpOverlay')?.classList.remove('show');}
function openSettings(){$('settingsPanel')?.classList.add('open');$('settingsOverlay')?.classList.add('show');}
function closeSettings(){$('settingsPanel')?.classList.remove('open');$('settingsOverlay')?.classList.remove('show');}
function openLog(){$('logPanel')?.classList.add('open');}
function closeLog(){$('logPanel')?.classList.remove('open');}
function toggleLog(){$('logPanel')?.classList.toggle('open');}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}

/* ═══════ LORA SIMULATION ═══════ */
const wfCanvas = $('waterfallCanvas');
const wfCtx = wfCanvas ? wfCanvas.getContext('2d') : null;
let wfData = [];
let chirpActive = false;
let chirpPhase = 0;
let animFrame;

function getLoraParams() {
  const sf = parseInt($('sfSelect')?.value || 12);
  const bw = parseInt($('bwSelect')?.value || 125);
  const power = parseInt($('powerSelect')?.value || 20);
  const dataRate = Math.round(sf * (bw * 1000) / Math.pow(2, sf) * 0.8);
  const snrTable = {7:-7.5,8:-10,9:-12.5,10:-15,11:-17.5,12:-20};
  const sensitivity = -174 + 10*Math.log10(bw*1000) + 6 + (snrTable[sf]||-20);
  const linkBudget = power - sensitivity;
  const range = Math.pow(10, (linkBudget - 32.44 - 20*Math.log10(868)) / 20);
  const tSym = Math.pow(2,sf) / (bw*1000) * 1000;
  const nSym = 8 + Math.max(Math.ceil((80-4*sf+28)/(4*sf))*5, 0);
  const airtime = Math.round((12.25+nSym)*tSym);
  return {sf,bw,power,dataRate,sensitivity:Math.round(sensitivity),range:range.toFixed(1),airtime,linkBudget:Math.round(linkBudget)};
}

function updateRangeDisplay(){
  const p=getLoraParams();
  const rv=$('rangeValue'),dr=$('dataRateValue'),at=$('airtimeValue');
  if(rv)rv.textContent=p.range+' km';
  if(dr)dr.textContent=p.dataRate+' bps';
  if(at)at.textContent=p.airtime+' ms';
}

function initWaterfall(){
  if(!wfCtx)return;
  const W=wfCanvas.width,H=wfCanvas.height; wfData=[];
  for(let i=0;i<H;i++){const row=new Float32Array(W);for(let x=0;x<W;x++)row[x]=Math.random()*0.05;wfData.push(row);}
}

function addChirpLine(sf){
  if(!wfCtx)return;
  const W=wfCanvas.width;
  const row=new Float32Array(W);
  for(let x=0;x<W;x++)row[x]=Math.random()*0.08;
  if(chirpActive){
    const cw=W/(sf-5), center=chirpPhase%W;
    for(let i=-cw/2;i<cw/2;i++){
      const idx=Math.floor((center+i+W)%W);
      if(idx>=0&&idx<W){const d=Math.abs(i)/(cw/2);row[idx]=Math.max(row[idx],(1-d*d)*0.9+Math.random()*0.1);}
    }
    chirpPhase+=W/(sf*2);
  }
  wfData.push(row);
  if(wfData.length>wfCanvas.height)wfData.shift();
}

function drawWaterfall(){
  if(!wfCtx)return;
  const W=wfCanvas.width,H=wfCanvas.height;
  const img=wfCtx.createImageData(W,H);
  for(let y=0;y<Math.min(wfData.length,H);y++){
    const row=wfData[y];
    for(let x=0;x<W;x++){
      const v=row[x],idx=(y*W+x)*4;
      if(v<0.25){img.data[idx]=0;img.data[idx+1]=Math.floor(v*4*255);img.data[idx+2]=255;}
      else if(v<0.5){img.data[idx]=0;img.data[idx+1]=255;img.data[idx+2]=Math.floor((1-(v-0.25)*4)*255);}
      else if(v<0.75){img.data[idx]=Math.floor((v-0.5)*4*255);img.data[idx+1]=255;img.data[idx+2]=0;}
      else{img.data[idx]=255;img.data[idx+1]=Math.floor((1-(v-0.75)*4)*255);img.data[idx+2]=0;}
      img.data[idx+3]=255;
    }
  }
  wfCtx.putImageData(img,0,0);
  wfCtx.fillStyle='rgba(255,255,255,0.7)';wfCtx.font='10px Orbitron,monospace';
  wfCtx.fillText('868.0 MHz',5,12);wfCtx.fillText('868.125 MHz',W-80,12);
}

function drawRangeGraph(){
  const canvas=$('rangeCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
  for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(i*W/10,0);ctx.lineTo(i*W/10,H);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*H/10);ctx.lineTo(W,i*H/10);ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='11px Orbitron,monospace';
  ctx.fillText('TX Power (dBm)',W/2-50,H-5);
  ctx.save();ctx.rotate(-Math.PI/2);ctx.fillText('Range (km)',-H/2-30,14);ctx.restore();
  const sfs=[{sf:7,color:'#0f0'},{sf:9,color:'#44f'},{sf:12,color:'#a0f'}];
  const powers=[2,5,8,10,12,14,17,20],maxRange=25;
  sfs.forEach(({sf,color})=>{
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
    powers.forEach((p,i)=>{
      const snr={7:-7.5,9:-12.5,12:-20};const sens=-174+10*Math.log10(125000)+6+snr[sf];
      const lb=p-sens;const range=Math.pow(10,(lb-32.44-20*Math.log10(868))/20);
      const x=40+(p-2)/18*(W-60),y=H-30-Math.min(range,maxRange)/maxRange*(H-50);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });ctx.stroke();
    ctx.fillStyle=color;
    powers.forEach(p=>{
      const snr={7:-7.5,9:-12.5,12:-20};const sens=-174+10*Math.log10(125000)+6+snr[sf];
      const lb=p-sens;const range=Math.pow(10,(lb-32.44-20*Math.log10(868))/20);
      const x=40+(p-2)/18*(W-60),y=H-30-Math.min(range,maxRange)/maxRange*(H-50);
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();
    });
  });
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='9px monospace';
  powers.forEach(p=>{const x=40+(p-2)/18*(W-60);ctx.fillText(p+'',x-5,H-18);});
  for(let r=0;r<=maxRange;r+=5){const y=H-30-r/maxRange*(H-50);ctx.fillText(r+'km',2,y+3);}
}

function sendLoraMessage(){
  const msg=$('msgInput')?.value||'HELLO';
  if(!msg.trim())return;
  const p=getLoraParams();
  chirpActive=true;chirpPhase=0;playSound('click');
  log(`TX [SF${p.sf}/${p.bw}kHz/${p.power}dBm] "${msg}" — ${p.airtime}ms airtime`,'tx');
  setStatus(true);showToast(LANG[currentLang]?.msgSent||'Sent',2000);
  const ll=$('loraLog');
  if(ll){
    const ts=new Date().toLocaleTimeString();
    ll.innerHTML+=`<div style="margin-bottom:4px;color:#0f0">📡 ${ts} TX SF${p.sf} BW${p.bw} PWR${p.power} → "${msg}" [${p.airtime}ms]</div>`;
    setTimeout(()=>{
      const rssi=-40-Math.random()*80,snr=10-Math.random()*15;
      ll.innerHTML+=`<div style="margin-bottom:4px;color:#4af">📥 ${new Date().toLocaleTimeString()} RX RSSI:${rssi.toFixed(0)}dBm SNR:${snr.toFixed(1)}dB → "${msg}"</div>`;
      log(`RX "${msg}" RSSI:${rssi.toFixed(0)}dBm SNR:${snr.toFixed(1)}dB`,'rx');
      ll.scrollTop=ll.scrollHeight;
    },p.airtime+500);
  }
  setTimeout(()=>{chirpActive=false;},p.airtime+200);
  $('msgInput').value='';
}

function animate(){addChirpLine(getLoraParams().sf);drawWaterfall();animFrame=requestAnimationFrame(animate);}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const lw=$('logoWrap'),sl=$('splashLogo');
  if(lw)lw.innerHTML=LOGO_SVG;if(sl)sl.innerHTML=LOGO_SVG;
  const savedLang=localStorage.getItem('lora-lang')||'en';
  const savedTheme=localStorage.getItem('lora-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',openHelp);
  $('helpCloseBtn')?.addEventListener('click',closeHelp);
  $('helpOverlay')?.addEventListener('click',closeHelp);
  $('settingsBtn')?.addEventListener('click',openSettings);
  $('settingsCloseBtn')?.addEventListener('click',closeSettings);
  $('settingsOverlay')?.addEventListener('click',closeSettings);
  $('logBtn')?.addEventListener('click',toggleLog);
  $('logCloseBtn')?.addEventListener('click',closeLog);
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked;});
  $('sendBtn')?.addEventListener('click',sendLoraMessage);
  $('msgInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendLoraMessage();});
  $('sfSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});
  $('bwSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});
  $('powerSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});

  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log(LANG[currentLang]?.logCleared||'Cleared','info');});
  $('copyLogBtn')?.addEventListener('click',()=>{
    navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast(LANG[currentLang]?.copied||'Copied',1500)).catch(()=>showToast(LANG[currentLang]?.copyFail||'Failed',1500));
  });
  $('exportLogBtn')?.addEventListener('click',()=>{
    const blob=new Blob([$('logContainer')?.innerText||''],{type:'text/plain'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='lora-lab-log.txt';a.click();
  });

  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');const f=btn.dataset.filter;
      document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none';});
    });
  });

  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      const tgt=tab.dataset.tab;
      if(tgt==='faq')$('helpFaq')?.classList.add('active');
      if(tgt==='howto')$('helpHowto')?.classList.add('active');
      if(tgt==='wiki')$('helpWiki')?.classList.add('active');
    });
  });

  initWaterfall();updateRangeDisplay();drawRangeGraph();animate();
  setStatus(false);log(LANG[currentLang]?.ready||'Ready','success');

  setInterval(()=>{
    if(!chirpActive&&Math.random()<0.3){chirpActive=true;chirpPhase=Math.random()*(wfCanvas?.width||800);setTimeout(()=>{chirpActive=false;},500+Math.random()*1000);}
  },3000);
});
