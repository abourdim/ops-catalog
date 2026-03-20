/**
 * Workshop DIY — Password Cracker v1.2
 * Attack Simulator — Brute force, dictionary, rainbow table
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}else{o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}}

const LANG={
  en:{title:'Password Cracker',subtitle:'🔓 Watch brute force, dictionary, and rainbow attacks',disconnected:'Disconnected',connected:'Connected',mainSection:'Attack Simulator',mainDesc:'Enter a password and watch different attacks try to crack it',sectionA:'Attack Methods Explained',sectionB:'Strong Password Guide',sectionC:'Password Strength Analyzer',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Password Cracker?',faq_a1:'An educational simulator showing how password attacks work.',faq_q2:'Is this real cracking?',faq_a2:'No. Simulated locally.',faq_q3:'How do I change the language?',faq_a3:'Open Settings.',faq_q4:'Is my data private?',faq_a4:'Yes. Local only.',howto_1:'Enter a password.',howto_2:'Choose attack type.',howto_3:'Watch the attack.',howto_4:'Analyze strength in Section C.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🔓 Password Cracker ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',bruteBtn:'Brute Force',dictBtn:'Dictionary',rainbowBtn:'Rainbow Table',stopBtn:'Stop',attempts:'Attempts',timeElapsed:'Time',speed:'Speed',cracked:'PASSWORD CRACKED!',methodsText:'Brute Force: every combination. Dictionary: wordlist. Rainbow Table: pre-computed hashes.',strongPwText:'Use 12+ chars, mix types. Avoid dictionary words. Use password manager. Enable 2FA.',analyzerText:'Analyze password strength and estimated crack time.',analyzeBtn:'Analyze Strength',attacking:'Attacking...',stopped:'Attack stopped',weak:'WEAK',medium:'MEDIUM',strong:'STRONG',veryStrong:'VERY STRONG',,step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data.',sectionCode:'Device Code'},
  fr:{title:'Craqueur de Mot de Passe',subtitle:'🔓 Regardez les attaques brute force, dictionnaire et rainbow',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Simulateur d\'Attaque',mainDesc:'Entrez un mot de passe et regardez les attaques',sectionA:'Methodes d\'Attaque',sectionB:'Guide Mots de Passe',sectionC:'Analyseur de Force',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le Craqueur ?',faq_a1:'Un simulateur educatif d\'attaques.',faq_q2:'C\'est reel ?',faq_a2:'Non. Simulation locale.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvrez Parametres.',faq_q4:'Donnees privees ?',faq_a4:'Oui. Local.',howto_1:'Entrez un mot de passe.',howto_2:'Choisissez le type d\'attaque.',howto_3:'Regardez l\'attaque.',howto_4:'Analysez la force.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🔓 Craqueur pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',bruteBtn:'Force Brute',dictBtn:'Dictionnaire',rainbowBtn:'Table Rainbow',stopBtn:'Stop',attempts:'Tentatives',timeElapsed:'Temps',speed:'Vitesse',cracked:'MOT DE PASSE CRAQUE !',methodsText:'Force Brute: chaque combinaison. Dictionnaire: liste de mots. Rainbow: hachages precalcules.',strongPwText:'Utilisez 12+ caracteres, melangez les types. Utilisez un gestionnaire.',analyzerText:'Analysez la force et le temps de craquage.',analyzeBtn:'Analyser la Force',attacking:'Attaque en cours...',stopped:'Attaque arretee',weak:'FAIBLE',medium:'MOYEN',strong:'FORT',veryStrong:'TRES FORT',,step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues.',sectionCode:'Code Appareil'},
  ar:{title:'كاسر كلمات المرور',subtitle:'🔓 شاهد هجمات القوة العمياء والقاموس وجدول قوس قزح',disconnected:'غير متصل',connected:'متصل',mainSection:'محاكي الهجوم',mainDesc:'ادخل كلمة مرور وشاهد الهجمات المختلفة',sectionA:'شرح طرق الهجوم',sectionB:'دليل كلمات المرور القوية',sectionC:'محلل قوة كلمة المرور',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو كاسر كلمات المرور؟',faq_a1:'محاكي تعليمي لهجمات كلمات المرور.',faq_q2:'هل هذا حقيقي؟',faq_a2:'لا. محاكاة محلية.',faq_q3:'كيف اغير اللغة؟',faq_a3:'افتح الاعدادات.',faq_q4:'بياناتي خاصة؟',faq_a4:'نعم. محلي.',howto_1:'ادخل كلمة مرور.',howto_2:'اختر نوع الهجوم.',howto_3:'شاهد الهجوم.',howto_4:'حلل القوة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🔓 كاسر كلمات المرور جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',bruteBtn:'قوة عمياء',dictBtn:'قاموس',rainbowBtn:'جدول قوس قزح',stopBtn:'ايقاف',attempts:'المحاولات',timeElapsed:'الوقت',speed:'السرعة',cracked:'تم كسر كلمة المرور!',methodsText:'القوة العمياء: كل التركيبات. القاموس: قائمة كلمات. Rainbow: تجزئات محسوبة مسبقا.',strongPwText:'استخدم 12+ حرفا واخلط الانواع. استخدم مدير كلمات المرور.',analyzerText:'حلل قوة كلمة المرور ووقت الكسر المقدر.',analyzeBtn:'تحليل القوة',attacking:'جاري الهجوم...',stopped:'توقف الهجوم',weak:'ضعيف',medium:'متوسط',strong:'قوي',veryStrong:'قوي جدا',,step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة.',sectionCode:'كود الجهاز'}
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

/* ═══════ PASSWORD CRACKER SIMULATION ═══════ */

const DICT_WORDS=['password','123456','qwerty','abc123','monkey','master','dragon','111111','baseball','iloveyou','trustno1','sunshine','letmein','welcome','shadow','ashley','football','jesus','michael','ninja','mustang','password1','123456789','12345678','1234567','secret','secret123','admin','login','hello','charlie','donald','batman','access','thunder','matrix','pass123','test123','love123','hunter2'];
const CHARS='abcdefghijklmnopqrstuvwxyz';const CHARS_FULL='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
let attacking=false;let attackTimer=null;

function stopAttack(){attacking=false;if(attackTimer){clearInterval(attackTimer);attackTimer=null;}const s=LANG[currentLang];$('stopBtn')&&($('stopBtn').style.display='none');hideToast();log(s.stopped,'info');}

async function bruteForceAttack(){
  if(attacking)return;attacking=true;
  const s=LANG[currentLang];const pw=($('passwordInput')||{}).value||'abc';
  const display=$('attackDisplay'),progress=$('progressBar'),attempts=$('attemptCount'),timeDisp=$('timeDisplay'),speedDisp=$('speedDisplay'),resultBox=$('resultBox'),stopBtn=$('stopBtn');
  if(stopBtn)stopBtn.style.display='';if(resultBox)resultBox.style.display='none';
  showToast(s.attacking);log(`💪 Brute Force: "${pw}" (${pw.length} chars)`,'tx');setStatus(true);
  let count=0;const start=Date.now();let found='';
  const maxIter=pw.length*200;

  for(let pos=0;pos<pw.length&&attacking;pos++){
    const target=pw[pos];let charSet=CHARS_FULL;
    for(let i=0;i<charSet.length&&attacking;i++){
      count++;const elapsed=(Date.now()-start)/1000;
      found=pw.slice(0,pos)+charSet[i]+'_'.repeat(Math.max(0,pw.length-pos-1));
      if(display)display.textContent=found;
      if(attempts)attempts.textContent=count.toLocaleString();
      if(timeDisp)timeDisp.textContent=elapsed.toFixed(1)+'s';
      if(speedDisp)speedDisp.textContent=Math.round(count/Math.max(elapsed,0.1))+'/s';
      if(progress)progress.style.width=((pos*charSet.length+i)/(pw.length*charSet.length)*100)+'%';
      if(charSet[i]===target)break;
      if(i%3===0)await sleep(15);
    }
  }
  if(attacking){
    if(display){display.textContent=pw;display.style.color='#33ff33';}
    if(progress)progress.style.width='100%';
    if(resultBox){resultBox.style.display='block';resultBox.style.background='#33cc5522';resultBox.style.border='2px solid #33cc55';resultBox.innerHTML=`🔓 ${s.cracked}<br><span style="font-family:Orbitron;font-size:1.5rem;letter-spacing:3px;">${pw}</span>`;}
    hideToast();log(`🔓 ${s.cracked} "${pw}" in ${((Date.now()-start)/1000).toFixed(1)}s (${count} attempts)`,'success');
    setTimeout(()=>{if(display)display.style.color='#33ff33';},100);
  }
  attacking=false;if(stopBtn)stopBtn.style.display='none';
}

async function dictionaryAttack(){
  if(attacking)return;attacking=true;
  const s=LANG[currentLang];const pw=($('passwordInput')||{}).value||'abc';
  const display=$('attackDisplay'),progress=$('progressBar'),attempts=$('attemptCount'),timeDisp=$('timeDisplay'),speedDisp=$('speedDisplay'),resultBox=$('resultBox'),stopBtn=$('stopBtn');
  if(stopBtn)stopBtn.style.display='';if(resultBox)resultBox.style.display='none';
  showToast(s.attacking);log(`📖 Dictionary Attack: "${pw}"`,'tx');setStatus(true);
  const start=Date.now();let found=false;

  for(let i=0;i<DICT_WORDS.length&&attacking;i++){
    const word=DICT_WORDS[i];
    if(display)display.textContent=word;
    if(attempts)attempts.textContent=(i+1).toString();
    const elapsed=(Date.now()-start)/1000;
    if(timeDisp)timeDisp.textContent=elapsed.toFixed(1)+'s';
    if(speedDisp)speedDisp.textContent=Math.round((i+1)/Math.max(elapsed,0.1))+'/s';
    if(progress)progress.style.width=((i+1)/DICT_WORDS.length*100)+'%';
    if(word===pw.toLowerCase()){found=true;break;}
    await sleep(80);
  }
  if(found&&attacking){
    if(display){display.textContent=pw;display.style.color='#33ff33';}
    if(progress)progress.style.width='100%';
    if(resultBox){resultBox.style.display='block';resultBox.style.background='#33cc5522';resultBox.style.border='2px solid #33cc55';resultBox.innerHTML=`📖 ${s.cracked}<br><span style="font-family:Orbitron;font-size:1.5rem;">${pw}</span>`;}
    log(`📖 ${s.cracked} "${pw}" — found in dictionary!`,'success');
  }else if(attacking){
    if(resultBox){resultBox.style.display='block';resultBox.style.background='#33cc5522';resultBox.style.border='2px solid #33cc55';resultBox.textContent='Not found in dictionary. Password survived!';}
    log('📖 Password not in dictionary','info');
  }
  hideToast();attacking=false;if(stopBtn)stopBtn.style.display='none';
}

async function rainbowAttack(){
  if(attacking)return;attacking=true;
  const s=LANG[currentLang];const pw=($('passwordInput')||{}).value||'abc';
  const display=$('attackDisplay'),progress=$('progressBar'),attempts=$('attemptCount'),timeDisp=$('timeDisplay'),speedDisp=$('speedDisplay'),resultBox=$('resultBox'),stopBtn=$('stopBtn');
  if(stopBtn)stopBtn.style.display='';if(resultBox)resultBox.style.display='none';
  showToast(s.attacking);log(`🌈 Rainbow Table Attack: "${pw}"`,'tx');setStatus(true);
  const start=Date.now();

  // Fake hash computation display
  const fakeHash=Array.from(pw).map(c=>c.charCodeAt(0).toString(16)).join('')+'a3f8c1d9e2b7';
  if(display)display.textContent='Computing hash...';
  await sleep(500);
  if(display)display.textContent='SHA256: '+fakeHash.slice(0,24)+'...';
  if(attempts)attempts.textContent='1';
  await sleep(400);

  // Lookup animation
  const tableSize=50+Math.floor(Math.random()*100);
  for(let i=0;i<tableSize&&attacking;i++){
    const fakeEntry=Array.from({length:12},()=>CHARS_FULL[Math.floor(Math.random()*CHARS_FULL.length)]).join('');
    if(display)display.textContent=`[${i+1}/${tableSize}] ${fakeEntry} → ${Math.random().toString(16).slice(2,14)}`;
    if(progress)progress.style.width=((i+1)/tableSize*100)+'%';
    if(attempts)attempts.textContent=(i+2).toString();
    const elapsed=(Date.now()-start)/1000;
    if(timeDisp)timeDisp.textContent=elapsed.toFixed(1)+'s';
    if(speedDisp)speedDisp.textContent=Math.round((i+2)/Math.max(elapsed,0.1))+'/s';
    await sleep(30);
  }
  if(attacking){
    if(display){display.textContent=pw;display.style.color='#33ff33';}
    if(progress)progress.style.width='100%';
    if(resultBox){resultBox.style.display='block';resultBox.style.background='#33cc5522';resultBox.style.border='2px solid #33cc55';resultBox.innerHTML=`🌈 ${s.cracked}<br>Hash match found!<br><span style="font-family:Orbitron;font-size:1.5rem;">${pw}</span>`;}
    log(`🌈 ${s.cracked} via rainbow table in ${((Date.now()-start)/1000).toFixed(1)}s`,'success');
  }
  hideToast();attacking=false;if(stopBtn)stopBtn.style.display='none';
}

function analyzePassword(){
  const s=LANG[currentLang];const pw=($('passwordInput')||{}).value||'';
  const results=$('analyzeResults');if(!results)return;results.style.display='block';
  let score=0;const len=pw.length;
  if(len>=8)score+=1;if(len>=12)score+=1;if(len>=16)score+=1;
  if(/[a-z]/.test(pw))score+=1;if(/[A-Z]/.test(pw))score+=1;
  if(/[0-9]/.test(pw))score+=1;if(/[^a-zA-Z0-9]/.test(pw))score+=1;
  if(DICT_WORDS.includes(pw.toLowerCase()))score=Math.max(score-3,0);
  let label,color;
  if(score<=2){label=s.weak;color='#ff2222';}
  else if(score<=4){label=s.medium;color='#ffaa00';}
  else if(score<=5){label=s.strong;color='#33cc55';}
  else{label=s.veryStrong;color='#00ccff';}
  const charset=(/[^a-zA-Z0-9]/.test(pw)?95:/[A-Z]/.test(pw)?62:/[0-9]/.test(pw)?36:26);
  const combos=Math.pow(charset,len);
  const bruteTime=combos/1e9;// at 1 billion/sec
  let timeStr;
  if(bruteTime<1)timeStr='< 1 second';else if(bruteTime<60)timeStr=Math.round(bruteTime)+' seconds';else if(bruteTime<3600)timeStr=Math.round(bruteTime/60)+' minutes';else if(bruteTime<86400)timeStr=Math.round(bruteTime/3600)+' hours';else if(bruteTime<31536000)timeStr=Math.round(bruteTime/86400)+' days';else timeStr=Math.round(bruteTime/31536000).toLocaleString()+' years';
  results.innerHTML=`<div style="text-align:center;"><div style="font-size:1.5rem;font-weight:900;color:${color};font-family:Orbitron;">${label}</div><div style="font-size:.8rem;margin-top:.3rem;">Score: ${score}/7</div><div style="margin:.5rem 0;height:8px;border-radius:4px;background:#1a1a2e;"><div style="height:100%;width:${score/7*100}%;background:${color};border-radius:4px;transition:width .3s;"></div></div><div style="font-size:.8rem;">Length: ${len} | Charset: ${charset} chars</div><div style="font-size:.8rem;">Brute force time (1B/s): <strong>${timeStr}</strong></div>${DICT_WORDS.includes(pw.toLowerCase())?'<div style="color:#ff4444;margin-top:.3rem;font-weight:700;">Found in common dictionary!</div>':''}</div>`;
  log(`📊 Password analysis: ${label} (${score}/7)`,'info');
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
  $('bruteBtn')&&($('bruteBtn').onclick=bruteForceAttack);
  $('dictBtn')&&($('dictBtn').onclick=dictionaryAttack);
  $('rainbowBtn')&&($('rainbowBtn').onclick=rainbowAttack);
  $('stopBtn')&&($('stopBtn').onclick=stopAttack);
  $('analyzeBtn')&&($('analyzeBtn').onclick=analyzePassword);

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Password Entropy Visualizer Canvas ═══════ */
(function(){
let eCanvas,eCtx;const entropyBars=[];const crackParticles=[];
function createEC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Real-Time Attack Visualizer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=280;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawE(){
  if(!eCtx)return;const w=eCanvas.width,h=eCanvas.height;
  eCtx.fillStyle='rgba(6,13,26,0.08)';eCtx.fillRect(0,0,w,h);
  // Matrix rain background
  eCtx.fillStyle='rgba(51,255,51,0.03)';eCtx.font='10px monospace';
  for(let i=0;i<15;i++){const x=Math.random()*w,y=Math.random()*h;
    eCtx.fillText(CHARS_FULL[Math.floor(Math.random()*CHARS_FULL.length)],x,y);}
  // Password strength meter (animated bars)
  const pw=($('passwordInput')||{}).value||'';
  const metrics=[
    {label:'Length',val:Math.min(pw.length/20,1),color:'#4488ff'},
    {label:'Lowercase',val:/[a-z]/.test(pw)?1:0,color:'#33cc55'},
    {label:'Uppercase',val:/[A-Z]/.test(pw)?1:0,color:'#ffcc00'},
    {label:'Numbers',val:/[0-9]/.test(pw)?1:0,color:'#ff8800'},
    {label:'Symbols',val:/[^a-zA-Z0-9]/.test(pw)?1:0,color:'#ff4444'},
    {label:'Entropy',val:Math.min(pw.length*4/100,1),color:'#cc44ff'},
  ];
  const barW=70,barH=12,startX=30,startY=30;
  metrics.forEach((m,i)=>{
    const y=startY+i*(barH+14);
    // Animated fill
    if(!entropyBars[i])entropyBars[i]=0;
    entropyBars[i]+=(m.val-entropyBars[i])*0.08;
    eCtx.fillStyle='rgba(255,255,255,0.05)';eCtx.fillRect(startX+60,y,200,barH);
    eCtx.fillStyle=m.color+'88';eCtx.fillRect(startX+60,y,200*entropyBars[i],barH);
    eCtx.strokeStyle=m.color+'44';eCtx.lineWidth=1;eCtx.strokeRect(startX+60,y,200,barH);
    eCtx.fillStyle=m.color;eCtx.font='9px Orbitron,monospace';eCtx.textAlign='right';
    eCtx.fillText(m.label,startX+55,y+10);
    eCtx.textAlign='left';eCtx.fillText(Math.round(entropyBars[i]*100)+'%',startX+265,y+10);
  });
  // Crack attempt visualization (right side)
  const cx=w-180,cy=h/2;
  const lockSize=40;const crackT=Date.now()/1000;
  // Lock icon
  eCtx.strokeStyle=attacking?'#ff4444':'#33cc55';eCtx.lineWidth=3;
  eCtx.beginPath();eCtx.arc(cx,cy-lockSize/2,lockSize/3,Math.PI,0);eCtx.stroke();
  eCtx.fillStyle=attacking?'rgba(255,68,68,0.2)':'rgba(51,204,85,0.2)';
  eCtx.fillRect(cx-lockSize/2,cy-lockSize/4,lockSize,lockSize*0.7);
  eCtx.strokeRect(cx-lockSize/2,cy-lockSize/4,lockSize,lockSize*0.7);
  // Crack rays when attacking
  if(attacking){
    for(let i=0;i<8;i++){
      const a=crackT*2+i*Math.PI/4;const r=lockSize+Math.sin(crackT*5+i)*15;
      eCtx.beginPath();eCtx.moveTo(cx,cy);
      eCtx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      eCtx.strokeStyle='rgba(255,68,68,'+(0.1+Math.sin(crackT*3+i)*0.1)+')';
      eCtx.lineWidth=2;eCtx.stroke();
    }
    // Spawn crack particles
    if(Math.random()>0.7)crackParticles.push({x:cx,y:cy,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:1,color:'#ff4444'});
  }
  // Particles
  for(let i=crackParticles.length-1;i>=0;i--){
    const p=crackParticles[i];p.life-=0.02;p.x+=p.vx;p.y+=p.vy;
    if(p.life<=0){crackParticles.splice(i,1);continue;}
    eCtx.globalAlpha=p.life;eCtx.beginPath();eCtx.arc(p.x,p.y,2,0,Math.PI*2);
    eCtx.fillStyle=p.color;eCtx.fill();eCtx.globalAlpha=1;
  }
  // Brute force attempt counter
  eCtx.fillStyle='rgba(255,255,255,0.3)';eCtx.font='8px monospace';eCtx.textAlign='left';
  const charset=(/[^a-zA-Z0-9]/.test(pw)?95:/[A-Z]/.test(pw)?62:/[0-9]/.test(pw)?36:26);
  const combos=Math.pow(charset,pw.length||1);
  eCtx.fillText('Charset: '+charset+' | Combinations: '+combos.toExponential(2),10,h-8);
  eCtx.fillText('Status: '+(attacking?'ATTACKING':'IDLE'),10,h-20);
  requestAnimationFrame(drawE);
}
function initEC(){eCanvas=createEC();if(!eCanvas)return;eCtx=eCanvas.getContext('2d');
  const input=$('passwordInput');if(input)input.addEventListener('input',()=>{});
  drawE();}
setTimeout(initEC,1500);
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
