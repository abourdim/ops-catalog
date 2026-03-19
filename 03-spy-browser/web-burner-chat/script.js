/**
 * Workshop DIY — Burner Chat v1.2
 * Ephemeral P2P — Encrypted chat that vanishes
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}else{o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}}

const LANG={
  en:{title:'Burner Chat',subtitle:'💬 Encrypted chat that vanishes when you close the tab',disconnected:'Disconnected',connected:'Connected',mainSection:'Ephemeral P2P Chat',mainDesc:'Messages auto-destruct after the timer expires',sectionA:'How E2E Encryption Works',sectionB:'Ephemeral Messaging',sectionC:'Encryption Inspector',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Burner Chat?',faq_a1:'An ephemeral encrypted chat simulator with self-destructing messages.',faq_q2:'Is this real?',faq_a2:'No. Local simulation with fake peer.',faq_q3:'How do I change the language?',faq_a3:'Open Settings.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything is local and ephemeral.',howto_1:'Type a message and click Send.',howto_2:'Watch the encryption indicator.',howto_3:'Messages fade after the timer.',howto_4:'Inspect encryption in Section C.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'💬 Burner Chat ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',sendBtn:'Send',e2eLabel:'End-to-End Encrypted',timerLabel:'Self-destruct:',e2eText:'E2E encryption ensures only sender and recipient can read messages.',ephemeralText:'Ephemeral messages disappear after being read or after a timer.',inspectorText:'See the raw encrypted form of your messages.',inspectBtn:'Inspect Last Message',msgSent:'Message sent (encrypted)',msgReceived:'Reply received',msgBurned:'Message self-destructed',peerTyping:'Agent Shadow is typing...',},
  fr:{title:'Chat Ephemere',subtitle:'💬 Chat chiffre qui disparait quand vous fermez l\'onglet',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Chat P2P Ephemere',mainDesc:'Les messages s\'auto-detruisent apres le delai',sectionA:'Chiffrement E2E',sectionB:'Messagerie Ephemere',sectionC:'Inspecteur Chiffrement',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que Chat Ephemere ?',faq_a1:'Un simulateur de chat chiffre ephemere.',faq_q2:'C\'est reel ?',faq_a2:'Non. Simulation locale.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvrez Parametres.',faq_q4:'Donnees privees ?',faq_a4:'Oui. Local et ephemere.',howto_1:'Tapez et envoyez.',howto_2:'Regardez l\'indicateur de chiffrement.',howto_3:'Les messages disparaissent.',howto_4:'Inspectez le chiffrement.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'💬 Chat Ephemere pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',sendBtn:'Envoyer',e2eLabel:'Chiffrement bout-en-bout',timerLabel:'Auto-destruction:',e2eText:'Le chiffrement E2E garantit que seuls l\'expediteur et le destinataire lisent les messages.',ephemeralText:'Les messages ephemeres disparaissent apres lecture ou delai.',inspectorText:'Voyez la forme chiffree brute.',inspectBtn:'Inspecter Dernier Message',msgSent:'Message envoye (chiffre)',msgReceived:'Reponse recue',msgBurned:'Message auto-detruit',peerTyping:'Agent Ombre tape...',},
  ar:{title:'الدردشة المؤقتة',subtitle:'💬 دردشة مشفرة تختفي عند اغلاق التبويب',disconnected:'غير متصل',connected:'متصل',mainSection:'دردشة P2P مؤقتة',mainDesc:'الرسائل تتدمر ذاتيا بعد انتهاء المؤقت',sectionA:'كيف يعمل تشفير E2E',sectionB:'الرسائل المؤقتة',sectionC:'فاحص التشفير',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هي الدردشة المؤقتة؟',faq_a1:'محاكي دردشة مشفرة مؤقتة مع رسائل تتدمر ذاتيا.',faq_q2:'هل هذه حقيقية؟',faq_a2:'لا. محاكاة محلية.',faq_q3:'كيف اغير اللغة؟',faq_a3:'افتح الاعدادات.',faq_q4:'بياناتي خاصة؟',faq_a4:'نعم. محلي ومؤقت.',howto_1:'اكتب رسالة وارسل.',howto_2:'شاهد مؤشر التشفير.',howto_3:'الرسائل تتلاشى.',howto_4:'افحص التشفير.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'💬 الدردشة المؤقتة جاهزة!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',sendBtn:'ارسال',e2eLabel:'تشفير طرف لطرف',timerLabel:'تدمير ذاتي:',e2eText:'تشفير E2E يضمن ان المرسل والمستقبل فقط يقرآن الرسائل.',ephemeralText:'الرسائل المؤقتة تختفي بعد القراءة او المؤقت.',inspectorText:'شاهد الشكل المشفر الخام.',inspectBtn:'فحص اخر رسالة',msgSent:'تم ارسال الرسالة (مشفرة)',msgReceived:'تم استقبال الرد',msgBurned:'الرسالة تدمرت ذاتيا',peerTyping:'العميل الظل يكتب...',}
};

let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════ BURNER CHAT SIMULATION ═══════ */

const PEER_REPLIES = [
  'Roger that. Proceeding to rendezvous point.',
  'Copy. Intel received. Analyzing now.',
  'Understood. Maintain radio silence after this.',
  'Affirmative. Package is secure.',
  'Intel confirmed. Moving to phase 2.',
  'Be advised: area is hot. Proceed with caution.',
  'Acknowledged. ETA 15 minutes.',
  'Target acquired. Awaiting green light.',
  'Negative. Abort mission. Too many eyes.',
  'Wilco. Switching to backup frequency.',
  'All clear. Extraction point confirmed.',
  'Shadow reporting in. No hostile activity detected.',
];

let lastMsg = null;
let messageTimers = [];

function fakeEncryptMsg(text) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let enc = '';
  for (let i = 0; i < text.length; i++) {
    enc += chars[(text.charCodeAt(i) + i * 7 + 42) % chars.length];
  }
  return enc;
}

function addMessage(text, isMine, encrypted) {
  const s = LANG[currentLang];
  const container = $('chatMessages');
  if (!container) return;

  const timerVal = parseInt(($('timerSelect') || {}).value || '30');
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `display:flex;flex-direction:column;align-items:${isMine ? 'flex-end' : 'flex-start'};`;

  const bubble = document.createElement('div');
  bubble.style.cssText = `max-width:75%;padding:.5rem .8rem;border-radius:12px;font-size:.85rem;position:relative;background:${isMine ? 'var(--accent)' : 'var(--glass-bg)'};color:${isMine ? '#000' : 'inherit'};border:1px solid ${isMine ? 'transparent' : 'var(--glass-border)'};transition:opacity 1s, transform 1s;`;
  bubble.textContent = text;

  const meta = document.createElement('div');
  meta.style.cssText = 'font-size:.65rem;opacity:.5;margin-top:.2rem;display:flex;align-items:center;gap:.3rem;';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  meta.innerHTML = `🔒 ${now}${timerVal > 0 ? ` · ⏱️ ${timerVal}s` : ''}`;

  wrapper.appendChild(bubble);
  wrapper.appendChild(meta);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;

  lastMsg = { text, encrypted: fakeEncryptMsg(text), isMine };

  // Self-destruct timer
  if (timerVal > 0) {
    const timerId = setTimeout(() => {
      bubble.style.opacity = '0';
      bubble.style.transform = 'scale(0.8)';
      meta.innerHTML = `🔥 ${s.msgBurned}`;
      meta.style.color = '#ff4444';
      setTimeout(() => { if (wrapper.parentElement) wrapper.remove(); }, 1000);
      log(`🔥 ${s.msgBurned}`, 'info');
    }, timerVal * 1000);
    messageTimers.push(timerId);

    // Countdown on meta
    let remaining = timerVal;
    const countdownId = setInterval(() => {
      remaining--;
      if (remaining <= 0) { clearInterval(countdownId); return; }
      if (meta.parentElement) meta.innerHTML = `🔒 ${now} · ⏱️ ${remaining}s`;
    }, 1000);
  }
}

async function sendChatMessage() {
  const s = LANG[currentLang];
  const input = $('chatInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  if (input) input.value = '';

  addMessage(text, true);
  log(`📤 ${s.msgSent}`, 'tx');
  playSound('click');

  // Simulate peer typing
  await sleep(800 + Math.random() * 1500);
  const container = $('chatMessages');
  if (container) {
    const typing = document.createElement('div');
    typing.style.cssText = 'font-size:.75rem;opacity:.5;padding:.3rem 0;';
    typing.textContent = s.peerTyping;
    typing.id = 'typingIndicator';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  await sleep(1000 + Math.random() * 2000);
  const typingEl = $('typingIndicator');
  if (typingEl) typingEl.remove();

  const reply = PEER_REPLIES[Math.floor(Math.random() * PEER_REPLIES.length)];
  addMessage(reply, false);
  log(`📥 ${s.msgReceived}`, 'rx');
  playSound('success');
}

function inspectLastMessage() {
  const results = $('inspectResults');
  if (!results) return;
  if (!lastMsg) { results.style.display = 'block'; results.textContent = 'No messages yet.'; return; }
  results.style.display = 'block';
  results.innerHTML = `<div style="margin-bottom:.5rem;"><strong>Original:</strong><br>${lastMsg.text}</div><div style="margin-bottom:.5rem;"><strong>Encrypted (simulated AES-256-GCM):</strong><br><span style="color:var(--accent);">${lastMsg.encrypted}</span></div><div><strong>Key Exchange:</strong> ECDH P-256<br><strong>Cipher:</strong> AES-256-GCM<br><strong>HMAC:</strong> SHA-256<br><strong>Forward Secrecy:</strong> Yes (ephemeral keys)</div>`;
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  const chatSendBtn=$('chatSendBtn');if(chatSendBtn)chatSendBtn.onclick=sendChatMessage;
  const chatInput=$('chatInput');if(chatInput)chatInput.addEventListener('keydown',e=>{if(e.key==='Enter')sendChatMessage();});
  const inspectBtn=$('inspectBtn');if(inspectBtn)inspectBtn.onclick=inspectLastMessage;
  setStatus(true);

  // Welcome message from peer
  setTimeout(() => { addMessage('Agent Shadow online. Secure channel established. You may proceed.', false); }, 1500);

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED CANVAS VISUALIZATION — Encryption Flow ═══════ */
(function(){
const particles=[];
const encNodes=[
  {x:80,y:100,label:'You',icon:'👤',color:'#33cc55'},
  {x:300,y:60,label:'E2E Layer',icon:'🔐',color:'#ffcc00'},
  {x:520,y:100,label:'Agent Shadow',icon:'🕵️',color:'#4488ff'},
];
const relayNodes=[
  {x:190,y:180,label:'Relay A',icon:'📡',color:'#ff6644'},
  {x:410,y:180,label:'Relay B',icon:'📡',color:'#cc44ff'},
];
let simCanvas,simCtx;

function createSimCanvas(){
  const cards=document.querySelectorAll('.card');
  const target=cards.length>0?cards[0]:document.body;
  const wrap=document.createElement('div');
  wrap.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  wrap.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Encryption Flow Visualization</div>';
  const c=document.createElement('canvas');
  c.width=620;c.height=260;
  c.style.cssText='width:100%;height:auto;display:block;cursor:crosshair;background:#060d1a;';
  wrap.appendChild(c);target.appendChild(wrap);
  return c;
}

function spawnParticle(from,to,color){
  particles.push({x:from.x,y:from.y,tx:to.x,ty:to.y,t:0,color,speed:0.008+Math.random()*0.012,size:3+Math.random()*3,trail:[]});
}

function drawSim(){
  if(!simCtx)return;
  const w=simCanvas.width,h=simCanvas.height;
  simCtx.fillStyle='rgba(6,13,26,0.15)';simCtx.fillRect(0,0,w,h);
  simCtx.strokeStyle='#0a1a30';simCtx.lineWidth=0.3;
  for(let i=0;i<w;i+=30){simCtx.beginPath();simCtx.moveTo(i,0);simCtx.lineTo(i,h);simCtx.stroke();}
  for(let i=0;i<h;i+=30){simCtx.beginPath();simCtx.moveTo(0,i);simCtx.lineTo(w,i);simCtx.stroke();}
  const allNodes=[...encNodes,...relayNodes];
  [[0,3],[3,1],[1,4],[4,2]].forEach(([a,b])=>{
    simCtx.beginPath();simCtx.moveTo(allNodes[a].x,allNodes[a].y);simCtx.lineTo(allNodes[b].x,allNodes[b].y);
    simCtx.strokeStyle='rgba(100,150,200,0.15)';simCtx.lineWidth=1.5;simCtx.stroke();
  });
  allNodes.forEach(n=>{
    simCtx.beginPath();simCtx.arc(n.x,n.y,20,0,Math.PI*2);
    simCtx.fillStyle=n.color+'22';simCtx.fill();
    simCtx.strokeStyle=n.color;simCtx.lineWidth=2;simCtx.stroke();
    simCtx.fillStyle='#fff';simCtx.font='14px serif';simCtx.textAlign='center';
    simCtx.fillText(n.icon,n.x,n.y+5);
    simCtx.fillStyle=n.color;simCtx.font='9px Orbitron,monospace';
    simCtx.fillText(n.label,n.x,n.y+34);
  });
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.t+=p.speed;
    p.x+=(p.tx-p.x)*p.speed*3;p.y+=(p.ty-p.y)*p.speed*3;
    p.trail.push({x:p.x,y:p.y});if(p.trail.length>12)p.trail.shift();
    p.trail.forEach((pt,idx)=>{
      simCtx.beginPath();simCtx.arc(pt.x,pt.y,p.size*(idx/p.trail.length),0,Math.PI*2);
      simCtx.fillStyle=p.color+(Math.floor(25+idx*15).toString(16).padStart(2,'0'));simCtx.fill();
    });
    simCtx.beginPath();simCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
    simCtx.fillStyle=p.color;simCtx.fill();
    if(p.t>1||Math.abs(p.x-p.tx)<5&&Math.abs(p.y-p.ty)<5)particles.splice(i,1);
  }
  const pulse=Math.sin(Date.now()/400)*3;
  simCtx.beginPath();simCtx.arc(encNodes[1].x,encNodes[1].y,28+pulse,0,Math.PI*2);
  simCtx.strokeStyle='rgba(255,204,0,0.2)';simCtx.lineWidth=2;simCtx.stroke();
  simCtx.fillStyle='rgba(255,255,255,0.3)';simCtx.font='8px monospace';simCtx.textAlign='left';
  simCtx.fillText('Active packets: '+particles.length+' | E2E: AES-256-GCM | Forward Secrecy: ON',10,h-10);
  requestAnimationFrame(drawSim);
}

function initEnhancedSim(){
  simCanvas=createSimCanvas();if(!simCanvas)return;
  simCtx=simCanvas.getContext('2d');
  setInterval(()=>{
    if(Math.random()>0.4){
      const allN=[...encNodes,...relayNodes];const route=[0,3,1,4,2];
      const s=Math.floor(Math.random()*4);
      spawnParticle(allN[route[s]],allN[route[s+1]],['#33cc55','#ffcc00','#4488ff','#ff6644','#cc44ff'][Math.floor(Math.random()*5)]);
    }
  },600);
  simCanvas.addEventListener('click',()=>{
    const allN=[...encNodes,...relayNodes];const route=[0,3,1,4,2];
    for(let i=0;i<4;i++)setTimeout(()=>spawnParticle(allN[route[i]],allN[route[i+1]],'#33ff88'),i*150);
  });
  drawSim();
}
setTimeout(initEnhancedSim,1500);
})();
