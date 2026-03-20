/**
 * Workshop DIY — Dark Profile v1.2
 * Digital Footprint — Search usernames across platforms
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}

const LANG = {
  en: {
    title:'Dark Profile', subtitle:'🕵️ Search usernames across platforms',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Digital Footprint Scanner', mainDesc:'Enter a username to search across platforms',
    sectionA:'Platform Database', sectionB:'Privacy Protection', sectionC:'Exposure Analysis',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', export:'Export', filterAll:'All',
    settings:'⚙️ Settings', language:'Language',
    help:'❓ Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    howto_1:'Type a username in the search field.', howto_2:'Click Search to scan platforms.',
    howto_3:'View results and risk score.', howto_4:'Generate an exposure report.',
    wiki_themes_title:'🎨 Themes', wiki_themes:'8 built-in themes.',
    wiki_i18n_title:'🌐 Languages', wiki_i18n:'Trilingual: EN, FR, AR.',
    wiki_log_title:'📜 Activity Log', wiki_log:'Timestamped log.',
    wiki_privacy_title:'🔒 Privacy', wiki_privacy:'Local-first.',
    working:'Working…',
    t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina',
    t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'🕵️ Dark Profile ready!',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects', whisperMode:'Whisper mode', breathingGuide:'Breathing guide',
    dhikrTap:'Tap', musicMode:'Music reactive', splashHint:'tap to skip',
    langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →',
    searchBtn:'Search', enterUsername:'Enter a username first',
    searching:'Searching platforms...', searchDone:'Search complete!',
    found:'FOUND', notFound:'NOT FOUND', riskLabel:'Privacy Risk Score',
    platformText:'The scanner checks 15+ platforms including social media, coding sites, forums, and messaging apps.',
    privacyText:'Use unique usernames per platform, enable 2FA, review privacy settings regularly.',
    exposureText:'Cross-referencing usernames across platforms can reveal identity clusters.',
    exposureBtn:'Generate Exposure Report', generating:'Generating report...',
    reportDone:'Exposure report generated!',
    riskLow:'LOW RISK', riskMed:'MEDIUM RISK', riskHigh:'HIGH RISK', riskCritical:'CRITICAL RISK',step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It\'s like a spy gadget simulator! 🕵️ You get to play with real encryption, secret messages, and covert communication — the same tech real spies use.',faq_q2:'How does it work?',faq_a2:'The simulation runs right in your browser. It shows you step by step how secret agents protect their messages using math and radio signals.',faq_q3:'What should I try first?',faq_a3:'Hit the main button and watch what happens! 🎯 Then try changing the settings to see how it affects the results.',faq_q4:'What\'s the real science?',faq_a4:'This uses real cryptography — the same math that protects your WhatsApp messages and bank passwords! 🔐',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See if you can crack the code or intercept the message. That\'s how real security researchers think! 💪',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'100% safe! 🛡️ Everything runs locally in your browser. No internet needed, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Web Metadata Detective and Web Burner Chat! Each teaches something different. 🚀'},
  fr: {
    title:'Profil Sombre', subtitle:'🕵️ Rechercher des pseudos sur les plateformes',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Scanner Empreinte Numerique', mainDesc:'Entrez un pseudo pour rechercher sur les plateformes',
    sectionA:'Base de Plateformes', sectionB:'Protection Vie Privee', sectionC:'Analyse Exposition',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', export:'Exporter', filterAll:'Tout',
    settings:'⚙️ Parametres', language:'Langue',
    help:'❓ Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    howto_1:'Tapez un pseudo.', howto_2:'Cliquez Rechercher.',
    howto_3:'Voyez les resultats et le score.', howto_4:'Generez un rapport.',
    wiki_themes_title:'🎨 Themes', wiki_themes:'8 themes.',
    wiki_i18n_title:'🌐 Langues', wiki_i18n:'Trilingue.',
    wiki_log_title:'📜 Journal', wiki_log:'Journal horodate.',
    wiki_privacy_title:'🔒 Confidentialite', wiki_privacy:'Local-first.',
    working:'En cours…',
    t_mosque:'Mosquee', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'Medina',
    t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'🕵️ Profil Sombre pret !',
    logCleared:'Journal efface', copied:'Copie !', copyFail:'Echec',
    soundEffects:'🔊 Effets sonores', whisperMode:'Mode murmure', breathingGuide:'Guide respiratoire',
    dhikrTap:'Tap', musicMode:'Reactif musique', splashHint:'appuyer pour passer',
    langChanged:'🌐 Langue → Francais', themeChanged:'🎨 Theme →',
    searchBtn:'Rechercher', enterUsername:'Entrez un pseudo d\'abord',
    searching:'Recherche en cours...', searchDone:'Recherche terminee !',
    found:'TROUVE', notFound:'NON TROUVE', riskLabel:'Score de Risque',
    platformText:'Le scanner verifie 15+ plateformes.',
    privacyText:'Utilisez des pseudos uniques par plateforme.',
    exposureText:'Le croisement des pseudos peut reveler des clusters d\'identite.',
    exposureBtn:'Generer Rapport', generating:'Generation...',
    reportDone:'Rapport genere !',
    riskLow:'RISQUE FAIBLE', riskMed:'RISQUE MOYEN', riskHigh:'RISQUE ELEVE', riskCritical:'RISQUE CRITIQUE',step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'C\'est comme un simulateur de gadget d\'espion ! 🕵️ Tu peux jouer avec du vrai chiffrement et des messages secrets.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle te montre étape par étape comment les agents secrets protègent leurs messages.',faq_q3:'Que dois-je essayer d\'abord ?',faq_a3:'Clique sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'Ça utilise de la vraie cryptographie — les mêmes maths qui protègent tes messages WhatsApp ! 🔐',faq_q5:'Je peux le casser ?',faq_a5:'Essaie la section Labo ! Vois si tu peux craquer le code. C\'est comme ça que pensent les vrais chercheurs ! 💪',faq_q6:'Quel matériel me faut-il ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'100% sûr ! 🛡️ Tout tourne localement dans ton navigateur. Pas besoin d\'internet.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Metadata Detective and Web Burner Chat ! Chacune enseigne quelque chose de différent. 🚀'},
  ar: {
    title:'الملف المظلم', subtitle:'🕵️ البحث عن اسماء المستخدمين عبر المنصات',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'ماسح البصمة الرقمية', mainDesc:'ادخل اسم مستخدم للبحث عبر المنصات',
    sectionA:'قاعدة المنصات', sectionB:'حماية الخصوصية', sectionC:'تحليل التعرض',
    activityLog:'سجل النشاط', eventsMsg:'الاحداث والرسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', export:'تصدير', filterAll:'الكل',
    settings:'⚙️ الاعدادات', language:'اللغة',
    help:'❓ مساعدة', faq:'اسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    howto_1:'اكتب اسم مستخدم.', howto_2:'انقر بحث.',
    howto_3:'شاهد النتائج ودرجة المخاطر.', howto_4:'ولد تقرير التعرض.',
    wiki_themes_title:'🎨 المظاهر', wiki_themes:'8 مظاهر.',
    wiki_i18n_title:'🌐 اللغات', wiki_i18n:'ثلاثي اللغات.',
    wiki_log_title:'📜 سجل النشاط', wiki_log:'سجل مؤرخ.',
    wiki_privacy_title:'🔒 الخصوصية', wiki_privacy:'محلي اولا.',
    working:'جار…',
    t_mosque:'مسجد', t_zellige:'زليج', t_andalus:'اندلس', t_riad:'رياض', t_medina:'مدينة',
    t_space:'فضاء', t_jungle:'ادغال', t_robot:'روبوت',
    ready:'🕵️ الملف المظلم جاهز!',
    logCleared:'تم مسح السجل', copied:'تم النسخ!', copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية', whisperMode:'وضع الهمس', breathingGuide:'دليل التنفس',
    dhikrTap:'اضغط', musicMode:'تفاعل موسيقي', splashHint:'انقر للتخطي',
    langChanged:'🌐 اللغة ← العربية', themeChanged:'🎨 المظهر ←',
    searchBtn:'بحث', enterUsername:'ادخل اسم مستخدم اولا',
    searching:'جاري البحث...', searchDone:'اكتمل البحث!',
    found:'موجود', notFound:'غير موجود', riskLabel:'درجة مخاطر الخصوصية',
    platformText:'الماسح يفحص 15+ منصة.',
    privacyText:'استخدم اسماء فريدة لكل منصة.',
    exposureText:'مقارنة الاسماء عبر المنصات يكشف مجموعات الهوية.',
    exposureBtn:'توليد تقرير التعرض', generating:'جاري التوليد...',
    reportDone:'تم توليد التقرير!',
    riskLow:'خطر منخفض', riskMed:'خطر متوسط', riskHigh:'خطر مرتفع', riskCritical:'خطر حرج',step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'إنه مثل محاكي أدوات التجسس! 🕵️ يمكنك اللعب بتشفير حقيقي ورسائل سرية.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تُظهر لك خطوة بخطوة كيف يحمي العملاء السريون رسائلهم.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم غيّر الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'يستخدم تشفيراً حقيقياً — نفس الرياضيات التي تحمي رسائل WhatsApp! 🔐',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب قسم المختبر! حاول كسر الشيفرة. هكذا يفكر الباحثون الأمنيون! 💪',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن 100%! 🛡️ كل شيء يعمل محلياً في متصفحك. لا حاجة للإنترنت.',faq_q8:'ماذا أجرب بعد ذلك؟',faq_a8:'جرب Web Metadata Detective and Web Burner Chat! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const txt=$('statusText'),pill=$('statusPill'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const target=$(id);if(target)target.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════ DARK PROFILE SIMULATION ═══════ */

const PLATFORMS = [
  { name: 'Twitter/X', icon: '🐦', category: 'social' },
  { name: 'Instagram', icon: '📸', category: 'social' },
  { name: 'Facebook', icon: '👤', category: 'social' },
  { name: 'TikTok', icon: '🎵', category: 'social' },
  { name: 'LinkedIn', icon: '💼', category: 'professional' },
  { name: 'GitHub', icon: '💻', category: 'coding' },
  { name: 'GitLab', icon: '🦊', category: 'coding' },
  { name: 'Stack Overflow', icon: '📚', category: 'coding' },
  { name: 'Reddit', icon: '🤖', category: 'forum' },
  { name: 'Discord', icon: '🎮', category: 'messaging' },
  { name: 'Telegram', icon: '✈️', category: 'messaging' },
  { name: 'YouTube', icon: '▶️', category: 'media' },
  { name: 'Twitch', icon: '🟣', category: 'media' },
  { name: 'Pinterest', icon: '📌', category: 'social' },
  { name: 'Spotify', icon: '🎧', category: 'media' },
  { name: 'Steam', icon: '🎮', category: 'gaming' },
  { name: 'Medium', icon: '📝', category: 'blog' },
  { name: 'Keybase', icon: '🔑', category: 'security' },
];

function hashUsername(username, platform) {
  let h = 0;
  const str = username.toLowerCase() + platform;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function isFoundOnPlatform(username, platform) {
  const h = hashUsername(username, platform.name);
  // ~50-70% hit rate depending on username
  const threshold = 0.35 + (username.length % 5) * 0.07;
  return (h % 100) / 100 > threshold;
}

let lastResults = [];

async function searchUsername() {
  const s = LANG[currentLang];
  const input = $('usernameInput');
  const username = input ? input.value.trim() : '';
  if (!username) { log(s.enterUsername, 'error'); return; }

  const grid = $('platformGrid');
  const statusEl = $('searchStatus');
  const riskEl = $('riskScore');
  if (!grid) return;

  grid.innerHTML = '';
  if (statusEl) { statusEl.style.display = 'block'; statusEl.textContent = s.searching; }
  if (riskEl) riskEl.style.display = 'none';
  showToast(s.searching);
  log(`🔍 ${s.searching} "${username}"`, 'tx');
  setStatus(true);

  lastResults = [];
  let foundCount = 0;

  for (let i = 0; i < PLATFORMS.length; i++) {
    const p = PLATFORMS[i];
    const found = isFoundOnPlatform(username, p);
    lastResults.push({ ...p, found });
    if (found) foundCount++;

    const card = document.createElement('div');
    card.style.cssText = `padding:.6rem;border-radius:6px;border:1px solid ${found ? '#33cc5566' : '#ff444466'};background:${found ? '#33cc5511' : '#ff444411'};font-size:.8rem;display:flex;align-items:center;gap:.4rem;opacity:0;transition:opacity .3s;`;
    card.innerHTML = `<span style="font-size:1.2rem;">${p.icon}</span><div><strong>${p.name}</strong><br><span style="color:${found?'#33cc55':'#ff4444'};font-weight:700;font-size:.75rem;">${found ? '✅ '+s.found : '❌ '+s.notFound}</span></div>`;
    grid.appendChild(card);
    await sleep(80);
    card.style.opacity = '1';
  }

  // Risk score
  const ratio = foundCount / PLATFORMS.length;
  const score = Math.round(ratio * 100);
  let riskLevel, riskColor;
  if (score < 25) { riskLevel = s.riskLow; riskColor = '#33cc55'; }
  else if (score < 50) { riskLevel = s.riskMed; riskColor = '#ffaa00'; }
  else if (score < 75) { riskLevel = s.riskHigh; riskColor = '#ff6600'; }
  else { riskLevel = s.riskCritical; riskColor = '#ff2222'; }

  if (riskEl) {
    riskEl.style.display = 'block';
    riskEl.style.background = riskColor + '22';
    riskEl.style.border = `2px solid ${riskColor}`;
    riskEl.innerHTML = `<div style="font-size:2rem;font-weight:900;color:${riskColor};font-family:Orbitron,monospace;">${score}%</div><div style="font-size:.9rem;font-weight:700;">${s.riskLabel}</div><div style="font-size:1.1rem;color:${riskColor};font-weight:700;margin-top:.3rem;">${riskLevel}</div><div style="font-size:.75rem;opacity:.7;margin-top:.3rem;">${foundCount}/${PLATFORMS.length} platforms</div>`;
  }

  if (statusEl) statusEl.textContent = `${s.searchDone} — ${foundCount}/${PLATFORMS.length}`;
  hideToast();
  log(`${s.searchDone} ${foundCount}/${PLATFORMS.length} — ${riskLevel}`, foundCount > PLATFORMS.length * 0.5 ? 'error' : 'success');
}

async function generateExposureReport() {
  const s = LANG[currentLang];
  const results = $('exposureResults');
  if (!results) return;
  if (lastResults.length === 0) { log(s.enterUsername, 'error'); return; }

  results.style.display = 'block';
  results.innerHTML = '';
  showToast(s.generating);
  log(s.generating, 'tx');
  await sleep(800);

  const found = lastResults.filter(r => r.found);
  const categories = {};
  found.forEach(r => { if (!categories[r.category]) categories[r.category] = []; categories[r.category].push(r.name); });

  // Category breakdown
  for (const [cat, platforms] of Object.entries(categories)) {
    const div = document.createElement('div');
    div.style.cssText = 'padding:.5rem;margin:.3rem 0;border-radius:4px;border-left:3px solid var(--accent);font-size:.8rem;';
    div.innerHTML = `<strong style="text-transform:capitalize;">${cat}</strong>: ${platforms.join(', ')}`;
    results.appendChild(div);
    await sleep(200);
  }

  // Recommendations
  const recs = document.createElement('div');
  recs.style.cssText = 'margin-top:.8rem;padding:.6rem;border-radius:6px;background:var(--glass-bg);font-size:.8rem;';
  recs.innerHTML = `<strong>⚠️ Recommendations:</strong><ul style="margin:.3rem 0 0 1rem;padding:0;"><li>Use different usernames per platform</li><li>Enable 2FA on all ${found.length} found accounts</li><li>Review privacy settings on each platform</li><li>Remove unused accounts</li><li>Limit public bio information</li></ul>`;
  results.appendChild(recs);

  hideToast();
  log(s.reportDone, 'success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  const searchBtn=$('searchBtn');if(searchBtn)searchBtn.onclick=searchUsername;
  const input=$('usernameInput');if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')searchUsername();});
  const exposureBtn=$('exposureBtn');if(exposureBtn)exposureBtn.onclick=generateExposureReport;

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED CANVAS — Digital Footprint Radar ═══════ */
(function(){
let rCanvas,rCtx,rAngle=0;
const CATS=[
  {name:'Social',angle:0,color:'#ff4488',items:['Twitter','Instagram','Facebook','TikTok']},
  {name:'Professional',angle:Math.PI*0.33,color:'#4488ff',items:['LinkedIn']},
  {name:'Coding',angle:Math.PI*0.66,color:'#44ff88',items:['GitHub','GitLab','StackOverflow']},
  {name:'Forum',angle:Math.PI,color:'#ffaa44',items:['Reddit']},
  {name:'Messaging',angle:Math.PI*1.33,color:'#cc44ff',items:['Discord','Telegram']},
  {name:'Media',angle:Math.PI*1.66,color:'#44ffff',items:['YouTube','Twitch','Spotify']},
];
const blips=[];
function createRC(){
  const cards=document.querySelectorAll('.card');
  const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');
  w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Digital Footprint Radar</div>';
  const c=document.createElement('canvas');c.width=600;c.height=400;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawR(){
  if(!rCtx)return;
  const w=rCanvas.width,h=rCanvas.height,cx=w/2,cy=h/2,maxR=Math.min(cx,cy)-40;
  rCtx.fillStyle='rgba(6,13,26,0.12)';rCtx.fillRect(0,0,w,h);
  for(let r=1;r<=4;r++){rCtx.beginPath();rCtx.arc(cx,cy,maxR*r/4,0,Math.PI*2);rCtx.strokeStyle='rgba(100,200,150,0.08)';rCtx.lineWidth=1;rCtx.stroke();}
  CATS.forEach(cat=>{
    const ex=cx+Math.cos(cat.angle)*maxR,ey=cy+Math.sin(cat.angle)*maxR;
    rCtx.beginPath();rCtx.moveTo(cx,cy);rCtx.lineTo(ex,ey);rCtx.strokeStyle='rgba(255,255,255,0.06)';rCtx.lineWidth=1;rCtx.stroke();
    rCtx.fillStyle=cat.color;rCtx.font='9px Orbitron,monospace';rCtx.textAlign='center';
    rCtx.fillText(cat.name,cx+Math.cos(cat.angle)*(maxR+20),cy+Math.sin(cat.angle)*(maxR+20));
  });
  rAngle+=0.015;
  const sx=cx+Math.cos(rAngle)*maxR,sy=cy+Math.sin(rAngle)*maxR;
  const gr=rCtx.createLinearGradient(cx,cy,sx,sy);
  gr.addColorStop(0,'rgba(76,255,120,0.4)');gr.addColorStop(1,'rgba(76,255,120,0)');
  rCtx.beginPath();rCtx.moveTo(cx,cy);rCtx.lineTo(sx,sy);rCtx.strokeStyle=gr;rCtx.lineWidth=2;rCtx.stroke();
  rCtx.beginPath();rCtx.moveTo(cx,cy);rCtx.arc(cx,cy,maxR,rAngle-0.4,rAngle);rCtx.lineTo(cx,cy);
  rCtx.fillStyle='rgba(76,255,120,0.04)';rCtx.fill();
  CATS.forEach(cat=>{
    const diff=Math.abs(((rAngle%(Math.PI*2))-cat.angle+Math.PI*2)%(Math.PI*2));
    if(diff<0.03&&Math.random()>0.6){
      cat.items.forEach(p=>{
        if(Math.random()>0.5){
          const d=0.3+Math.random()*0.6,sp=cat.angle+(Math.random()-0.5)*0.4;
          blips.push({x:cx+Math.cos(sp)*maxR*d,y:cy+Math.sin(sp)*maxR*d,life:1,color:cat.color,name:p,size:4+Math.random()*4});
        }
      });
    }
  });
  for(let i=blips.length-1;i>=0;i--){
    const b=blips[i];b.life-=0.005;if(b.life<=0){blips.splice(i,1);continue;}
    rCtx.globalAlpha=b.life;
    rCtx.beginPath();rCtx.arc(b.x,b.y,b.size*b.life,0,Math.PI*2);rCtx.fillStyle=b.color;rCtx.fill();
    rCtx.beginPath();rCtx.arc(b.x,b.y,b.size*b.life+4,0,Math.PI*2);rCtx.strokeStyle=b.color+'66';rCtx.lineWidth=1;rCtx.stroke();
    if(b.life>0.7){rCtx.fillStyle='rgba(255,255,255,0.7)';rCtx.font='7px monospace';rCtx.textAlign='center';rCtx.fillText(b.name,b.x,b.y-b.size-3);}
    rCtx.globalAlpha=1;
  }
  rCtx.beginPath();rCtx.arc(cx,cy,4,0,Math.PI*2);rCtx.fillStyle='#33ff88';rCtx.fill();
  rCtx.fillStyle='rgba(255,255,255,0.3)';rCtx.font='8px monospace';rCtx.textAlign='left';
  rCtx.fillText('Tracking: '+blips.length+' signals | Sweep: '+(rAngle/(Math.PI*2)*360%360).toFixed(0)+'deg',8,h-8);
  requestAnimationFrame(drawR);
}
function initR(){rCanvas=createRC();if(!rCanvas)return;rCtx=rCanvas.getContext('2d');
  rCanvas.addEventListener('click',e=>{const rect=rCanvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(rCanvas.width/rect.width),my=(e.clientY-rect.top)*(rCanvas.height/rect.height);
    for(let i=0;i<8;i++)blips.push({x:mx+(Math.random()-0.5)*40,y:my+(Math.random()-0.5)*40,life:1,color:CATS[Math.floor(Math.random()*CATS.length)].color,name:'Signal',size:3+Math.random()*5});
  });drawR();}
setTimeout(initR,1500);
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
