/**
 * Workshop DIY — Phishing Trainer v1.2
 * Spot the Fake — Score points by identifying phishing attempts
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}}

const LANG={
  en:{title:'Phishing Trainer',subtitle:'🎣 Score points by identifying phishing attempts',disconnected:'Disconnected',connected:'Connected',mainSection:'Spot the Fake',mainDesc:'Is this email/URL real or a phishing attempt?',sectionA:'Phishing Red Flags',sectionB:'Protection Guide',sectionC:'Statistics',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Phishing Trainer?',faq_a1:'A training game to identify phishing attempts.',faq_q2:'Are these real?',faq_a2:'No. All simulated.',faq_q3:'How do I change the language?',faq_a3:'Open Settings.',faq_q4:'Is my data private?',faq_a4:'Yes. Local only.',howto_1:'Read the email/URL scenario.',howto_2:'Click Legitimate or Phishing.',howto_3:'Read the explanation.',howto_4:'Click Next for more.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🎣 Phishing Trainer ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',realBtn:'Legitimate',fakeBtn:'Phishing',nextBtn:'Next Question',scoreLabel:'Score',questionLabel:'Question',correct:'Correct!',wrong:'Wrong!',redFlagsText:'Look for: misspelled domains, urgent language, suspicious sender, generic greetings, mismatched URLs.',protectionText:'Hover over links before clicking. Check sender domain. Never enter credentials from email links. Enable 2FA.',statsBtn:'Show Statistics',gameOver:'Game Over!',accuracy:'Accuracy',restart:'Restart',},
  fr:{title:'Entraineur Phishing',subtitle:'🎣 Marquez des points en identifiant les tentatives de phishing',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Trouvez le Faux',mainDesc:'Cet email/URL est-il reel ou du phishing ?',sectionA:'Signaux d\'alerte',sectionB:'Guide de protection',sectionC:'Statistiques',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que l\'Entraineur Phishing ?',faq_a1:'Un jeu pour identifier le phishing.',faq_q2:'Ce sont de vrais emails ?',faq_a2:'Non. Tout est simule.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvrez Parametres.',faq_q4:'Mes donnees sont privees ?',faq_a4:'Oui. Local.',howto_1:'Lisez le scenario.',howto_2:'Cliquez Legitime ou Phishing.',howto_3:'Lisez l\'explication.',howto_4:'Cliquez Suivant.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🎣 Entraineur Phishing pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',realBtn:'Legitime',fakeBtn:'Phishing',nextBtn:'Question Suivante',scoreLabel:'Score',questionLabel:'Question',correct:'Correct !',wrong:'Faux !',redFlagsText:'Cherchez: domaines mal orthographies, urgence, expediteur suspect, URL non concordantes.',protectionText:'Survolez les liens avant de cliquer. Verifiez le domaine expediteur. Activez la 2FA.',statsBtn:'Voir Statistiques',gameOver:'Partie Terminee !',accuracy:'Precision',restart:'Recommencer',},
  ar:{title:'مدرب التصيد',subtitle:'🎣 اكسب نقاطا بتحديد محاولات التصيد',disconnected:'غير متصل',connected:'متصل',mainSection:'اكتشف المزيف',mainDesc:'هل هذا البريد/الرابط حقيقي ام تصيد؟',sectionA:'علامات التصيد',sectionB:'دليل الحماية',sectionC:'الاحصائيات',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو مدرب التصيد؟',faq_a1:'لعبة تدريبية لتحديد محاولات التصيد.',faq_q2:'هل هذه رسائل حقيقية؟',faq_a2:'لا. كلها محاكاة.',faq_q3:'كيف اغير اللغة؟',faq_a3:'افتح الاعدادات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. محلي.',howto_1:'اقرا السيناريو.',howto_2:'انقر شرعي او تصيد.',howto_3:'اقرا التفسير.',howto_4:'انقر التالي.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🎣 مدرب التصيد جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',realBtn:'شرعي',fakeBtn:'تصيد',nextBtn:'السؤال التالي',scoreLabel:'النتيجة',questionLabel:'السؤال',correct:'صحيح!',wrong:'خطا!',redFlagsText:'ابحث عن: نطاقات مكتوبة خطا، لغة عاجلة، مرسل مشبوه.',protectionText:'مرر فوق الروابط قبل النقر. تحقق من نطاق المرسل. فعل المصادقة الثنائية.',statsBtn:'عرض الاحصائيات',gameOver:'انتهت اللعبة!',accuracy:'الدقة',restart:'اعادة',}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
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

/* ═══════ PHISHING SCENARIOS ═══════ */

const SCENARIOS = [
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> security@amaz0n-verify.com<br><strong>Subject:</strong> URGENT: Your account will be suspended!<br><br>Dear Customer,<br><br>We detected unusual activity on your account. Click <u style="color:#4488ff;">here</u> immediately to verify your identity or your account will be permanently suspended within 24 hours.<br><br>Amazon Security Team</div>',
    explanation:'Red flags: misspelled domain (amaz0n with zero), urgent threatening language, generic greeting "Dear Customer", pressure to act immediately, suspicious sender domain.',
  },
  { type:'email', fake:false,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> noreply@github.com<br><strong>Subject:</strong> [GitHub] A new device signed in<br><br>Hi username,<br><br>A new device signed into your GitHub account on March 15, 2024 from Chrome on Windows.<br><br>If this was you, no action is needed. If not, please review your security settings at github.com/settings/security.</div>',
    explanation:'Legitimate: correct domain (github.com), personalized greeting, informational tone (no threats), tells you no action needed if expected, directs to official domain.',
  },
  { type:'url', fake:true,
    content:'<div style="font-family:monospace;font-size:1.1rem;text-align:center;padding:1rem;"><span style="color:#ff4444;">https://www.paypa1.com/signin</span><br><br><div style="font-size:.8rem;font-family:sans-serif;">PayPal Login Page<br>"Enter your email and password to access your account"</div></div>',
    explanation:'Red flags: domain is "paypa1" (number 1 instead of letter l). Real PayPal is paypal.com. Attackers use lookalike characters to trick users.',
  },
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> admin@micros0ft-support.net<br><strong>Subject:</strong> Your Office 365 password expires today<br><br>Your password for Office 365 expires today. Click the button below to keep your current password.<br><br><span style="background:#0078d4;color:#fff;padding:8px 16px;border-radius:4px;">Keep My Password</span><br><br>If you did not request this, ignore this email.</div>',
    explanation:'Red flags: fake domain (micros0ft with zero, and .net instead of .com), passwords do not "expire" like this, Microsoft sends from microsoft.com, suspicious call-to-action.',
  },
  { type:'url', fake:false,
    content:'<div style="font-family:monospace;font-size:1.1rem;text-align:center;padding:1rem;"><span style="color:#33cc55;">https://accounts.google.com/signin</span><br><br><div style="font-size:.8rem;font-family:sans-serif;">Google Sign-In Page<br>🔒 Secure connection verified</div></div>',
    explanation:'Legitimate: correct official Google domain (accounts.google.com), HTTPS with valid certificate, standard sign-in page URL structure.',
  },
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> prince.ahmed@nigeria-royal.ng<br><strong>Subject:</strong> Urgent Business Proposal - $4.5M USD<br><br>Dear Friend,<br><br>I am Prince Ahmed, son of the late King. I need your help to transfer $4,500,000 USD. You will receive 30% commission. Please send your bank details immediately.<br><br>God Bless, Prince Ahmed</div>',
    explanation:'Classic advance-fee scam (419 scam): unsolicited offer of large money, requests bank details, urgent tone, claims royal connection, too good to be true.',
  },
  { type:'email', fake:false,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> no-reply@accounts.google.com<br><strong>Subject:</strong> Security alert for your Google Account<br><br>Hi User,<br><br>Someone just used your password to try to sign in to your account from a new device.<br><br>Details:<br>Date: March 15, 2024<br>Device: iPhone<br>Location: Paris, France<br><br>Check activity at myaccount.google.com</div>',
    explanation:'Legitimate: official Google domain, specific details provided, calm informational tone, directs to official Google domain, no request for credentials.',
  },
  { type:'url', fake:true,
    content:'<div style="font-family:monospace;font-size:1.1rem;text-align:center;padding:1rem;"><span style="color:#ff4444;">https://netflix-billing-update.herokuapp.com/login</span><br><br><div style="font-size:.8rem;font-family:sans-serif;">Netflix Login - Update Billing<br>"Please verify your payment method"</div></div>',
    explanation:'Red flags: not on netflix.com domain, hosted on herokuapp.com (free hosting), combines "billing-update" in URL to create urgency, Netflix would never host on third-party domains.',
  },
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> helpdesk@yourcompany-it.com<br><strong>Subject:</strong> IT Department: Mandatory Software Update<br><br>All Employees,<br><br>Please download and install the attached security patch immediately. Failure to comply within 2 hours will result in network access being revoked.<br><br>Attachment: security_update.exe<br><br>IT Department</div>',
    explanation:'Red flags: external domain pretending to be internal IT, executable attachment (.exe), artificial urgency with threats, legitimate IT would use internal systems not email attachments.',
  },
  { type:'url', fake:false,
    content:'<div style="font-family:monospace;font-size:1.1rem;text-align:center;padding:1rem;"><span style="color:#33cc55;">https://www.amazon.com/gp/css/order-history</span><br><br><div style="font-size:.8rem;font-family:sans-serif;">Amazon - Your Orders<br>🔒 Secure connection verified</div></div>',
    explanation:'Legitimate: official amazon.com domain, standard URL path structure for order history, HTTPS with valid certificate.',
  },
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> support@app1e-id.com<br><strong>Subject:</strong> Your Apple ID has been locked<br><br>Dear Apple User,<br><br>For your protection, your Apple ID has been locked due to suspicious activity. Verify your identity within 24 hours or your account will be permanently disabled.<br><br><span style="background:#333;color:#fff;padding:8px 16px;border-radius:4px;">Verify Now</span></div>',
    explanation:'Red flags: domain "app1e" uses number 1 instead of letter l, threatening language with deadline, generic greeting, Apple sends from apple.com.',
  },
  { type:'email', fake:false,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> noreply@linkedin.com<br><strong>Subject:</strong> John Smith viewed your profile<br><br>Hi User,<br><br>John Smith and 3 others viewed your profile this week.<br><br>See all views on linkedin.com/me/profile-views</div>',
    explanation:'Legitimate: official linkedin.com domain, standard notification format, no urgency, directs to official LinkedIn URL, common notification type.',
  },
];

let currentQ = 0, score = 0, answered = false;
let answers = [];

function showScenario() {
  const s = LANG[currentLang];
  const box = $('scenarioBox');
  const expl = $('explanation');
  const nextBtn = $('nextBtn');
  const realBtn = $('realBtn');
  const fakeBtn = $('fakeBtn');
  const qNum = $('questionNum');
  const scoreDisp = $('scoreDisplay');
  const totalDisp = $('totalDisplay');

  if (currentQ >= SCENARIOS.length) {
    // Game over
    if (box) {
      const pct = SCENARIOS.length > 0 ? Math.round(score / SCENARIOS.length * 100) : 0;
      box.innerHTML = `<div style="text-align:center;padding:1rem;"><div style="font-size:2rem;font-weight:900;font-family:Orbitron;">${s.gameOver}</div><div style="font-size:3rem;margin:.5rem 0;color:${pct >= 70 ? '#33cc55' : '#ff4444'};">${pct}%</div><div style="font-size:1rem;">${s.accuracy}: ${score}/${SCENARIOS.length}</div><br><button class="btn-sm primary" onclick="restartGame()">🔄 ${s.restart}</button></div>`;
    }
    if (realBtn) realBtn.style.display = 'none';
    if (fakeBtn) fakeBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (expl) expl.style.display = 'none';
    log(`${s.gameOver} ${score}/${SCENARIOS.length}`, score >= SCENARIOS.length * 0.7 ? 'success' : 'error');
    return;
  }

  const scenario = SCENARIOS[currentQ];
  if (box) box.innerHTML = `<div style="margin-bottom:.5rem;"><span style="font-size:.7rem;opacity:.6;text-transform:uppercase;letter-spacing:1px;">${scenario.type === 'email' ? '📧 EMAIL' : '🔗 URL'}</span></div>${scenario.content}`;
  if (expl) expl.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
  if (realBtn) { realBtn.style.display = ''; realBtn.disabled = false; }
  if (fakeBtn) { fakeBtn.style.display = ''; fakeBtn.disabled = false; }
  if (qNum) qNum.textContent = currentQ + 1;
  if (scoreDisp) scoreDisp.textContent = score;
  if (totalDisp) totalDisp.textContent = SCENARIOS.length;
  answered = false;
}

function answer(userSaysFake) {
  if (answered) return;
  answered = true;
  const s = LANG[currentLang];
  const scenario = SCENARIOS[currentQ];
  const correct = userSaysFake === scenario.fake;
  if (correct) score++;
  answers.push({ q: currentQ, correct });

  const expl = $('explanation');
  const nextBtn = $('nextBtn');
  const realBtn = $('realBtn');
  const fakeBtn = $('fakeBtn');
  const scoreDisp = $('scoreDisplay');

  if (scoreDisp) scoreDisp.textContent = score;
  if (realBtn) realBtn.disabled = true;
  if (fakeBtn) fakeBtn.disabled = true;

  if (expl) {
    expl.style.display = 'block';
    expl.style.background = correct ? '#33cc5522' : '#ff444422';
    expl.style.border = `1px solid ${correct ? '#33cc55' : '#ff4444'}`;
    expl.innerHTML = `<strong style="color:${correct ? '#33cc55' : '#ff4444'};">${correct ? '✅ ' + s.correct : '❌ ' + s.wrong}</strong><br><br>${scenario.explanation}`;
  }
  if (nextBtn) nextBtn.style.display = 'block';
  log(`${correct ? '✅' : '❌'} Q${currentQ + 1}: ${correct ? s.correct : s.wrong}`, correct ? 'success' : 'error');
  setStatus(true);
}

function nextQuestion() {
  currentQ++;
  showScenario();
}

function restartGame() {
  currentQ = 0; score = 0; answers = [];
  showScenario();
  log('🔄 Game restarted', 'info');
}

function showStats() {
  const s = LANG[currentLang];
  const results = $('statsResults');
  if (!results) return;
  results.style.display = 'block';
  const total = answers.length;
  const correct = answers.filter(a => a.correct).length;
  const pct = total > 0 ? Math.round(correct / total * 100) : 0;
  results.innerHTML = `<div style="text-align:center;font-size:.85rem;"><div style="font-size:2rem;font-weight:900;color:${pct >= 70 ? '#33cc55' : '#ff4444'};">${pct}%</div><div>${s.accuracy}: ${correct}/${total}</div><div style="margin-top:.5rem;">Phishing detected: ${answers.filter((a, i) => SCENARIOS[i] && SCENARIOS[i].fake && a.correct).length}</div><div>Legitimate identified: ${answers.filter((a, i) => SCENARIOS[i] && !SCENARIOS[i].fake && a.correct).length}</div></div>`;
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
  const realBtn=$('realBtn');if(realBtn)realBtn.onclick=()=>answer(false);
  const fakeBtn=$('fakeBtn');if(fakeBtn)fakeBtn.onclick=()=>answer(true);
  const nextBtn=$('nextBtn');if(nextBtn)nextBtn.onclick=nextQuestion;
  const statsBtn=$('statsBtn');if(statsBtn)statsBtn.onclick=showStats;
  showScenario();

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Threat Detection Matrix Canvas ═══════ */
(function(){
let tCanvas,tCtx;const threats=[];const scanLines=[];let tScore=0,tTotal=0;
function createTC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Threat Detection Matrix</div>';
  const c=document.createElement('canvas');c.width=620;c.height=260;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;';
  w.appendChild(c);t.appendChild(w);return c;
}
const THREAT_TYPES=[
  {name:'Spoofed Domain',color:'#ff4444',icon:'🔗'},
  {name:'Urgent Language',color:'#ff8800',icon:'⚠️'},
  {name:'Generic Greeting',color:'#ffcc00',icon:'👤'},
  {name:'Credential Request',color:'#cc44ff',icon:'🔑'},
  {name:'Mismatched URL',color:'#ff6699',icon:'🌐'},
  {name:'Legitimate',color:'#33cc55',icon:'✅'},
];
function spawnThreat(){
  const tt=THREAT_TYPES[Math.floor(Math.random()*THREAT_TYPES.length)];
  threats.push({x:tCanvas.width+20,y:30+Math.random()*(tCanvas.height-80),
    type:tt,speed:0.5+Math.random()*1.5,size:8+Math.random()*6,life:1,detected:false});
}
function drawT(){
  if(!tCtx)return;const w=tCanvas.width,h=tCanvas.height;
  tCtx.fillStyle='rgba(6,13,26,0.1)';tCtx.fillRect(0,0,w,h);
  // Grid
  tCtx.strokeStyle='#0a1a30';tCtx.lineWidth=0.3;
  for(let i=0;i<w;i+=25){tCtx.beginPath();tCtx.moveTo(i,0);tCtx.lineTo(i,h);tCtx.stroke();}
  for(let i=0;i<h;i+=25){tCtx.beginPath();tCtx.moveTo(0,i);tCtx.lineTo(w,i);tCtx.stroke();}
  // Detection line
  const lineX=w*0.3;tCtx.strokeStyle='rgba(255,255,255,0.1)';tCtx.lineWidth=2;
  tCtx.setLineDash([5,5]);tCtx.beginPath();tCtx.moveTo(lineX,0);tCtx.lineTo(lineX,h);tCtx.stroke();tCtx.setLineDash([]);
  tCtx.fillStyle='rgba(255,255,255,0.2)';tCtx.font='9px Orbitron,monospace';tCtx.textAlign='center';
  tCtx.fillText('DETECTION LINE',lineX,h-8);
  // Threats
  for(let i=threats.length-1;i>=0;i--){
    const t=threats[i];t.x-=t.speed;
    if(t.x<lineX&&!t.detected){t.detected=true;tTotal++;
      if(t.type.color!=='#33cc55')tScore++;
      scanLines.push({y:t.y,life:1,color:t.type.color});}
    if(t.x<-20||t.life<=0){threats.splice(i,1);continue;}
    if(t.detected)t.life-=0.02;
    tCtx.globalAlpha=t.life;
    // Threat dot
    tCtx.beginPath();tCtx.arc(t.x,t.y,t.size,0,Math.PI*2);
    tCtx.fillStyle=t.type.color+'44';tCtx.fill();
    tCtx.strokeStyle=t.type.color;tCtx.lineWidth=2;tCtx.stroke();
    tCtx.fillStyle='#fff';tCtx.font='10px serif';tCtx.textAlign='center';
    tCtx.fillText(t.type.icon,t.x,t.y+4);
    if(!t.detected){tCtx.fillStyle=t.type.color;tCtx.font='7px monospace';tCtx.fillText(t.type.name,t.x,t.y+t.size+10);}
    tCtx.globalAlpha=1;
  }
  // Scan lines
  for(let i=scanLines.length-1;i>=0;i--){
    const s=scanLines[i];s.life-=0.02;
    if(s.life<=0){scanLines.splice(i,1);continue;}
    tCtx.globalAlpha=s.life*0.3;tCtx.fillStyle=s.color;
    tCtx.fillRect(0,s.y-2,lineX,4);tCtx.globalAlpha=1;
  }
  // Score
  tCtx.fillStyle='rgba(255,255,255,0.5)';tCtx.font='10px Orbitron,monospace';tCtx.textAlign='left';
  tCtx.fillText('Detected: '+tScore+'/'+tTotal+' threats | Active: '+threats.length,10,18);
  // Legend
  const lx=w-180;
  THREAT_TYPES.forEach((tt,i)=>{
    tCtx.fillStyle=tt.color;tCtx.font='8px monospace';tCtx.textAlign='left';
    tCtx.fillText(tt.icon+' '+tt.name,lx,18+i*14);
  });
  requestAnimationFrame(drawT);
}
function initTC(){tCanvas=createTC();if(!tCanvas)return;tCtx=tCanvas.getContext('2d');
  setInterval(()=>{if(Math.random()>0.3)spawnThreat();},800);
  tCanvas.addEventListener('click',e=>{
    const rect=tCanvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(tCanvas.width/rect.width),my=(e.clientY-rect.top)*(tCanvas.height/rect.height);
    threats.forEach(t=>{if(Math.abs(t.x-mx)<15&&Math.abs(t.y-my)<15&&!t.detected){
      t.detected=true;t.life=0.5;tTotal++;if(t.type.color!=='#33cc55')tScore++;
      scanLines.push({y:t.y,life:1,color:t.type.color});}});
  });drawT();}
setTimeout(initTC,1500);
})();
