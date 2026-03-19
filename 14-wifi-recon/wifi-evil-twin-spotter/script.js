/**
 * Evil Twin Spotter — AP Verifier
 * AP comparison, mismatch alert
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
const LANG={
en:{title:'Evil Twin Spotter — AP Verifier',subtitle:'Detect rogue access points by attribute comparison',disconnected:'Disconnected',connected:'Scanning',mainSection:'AP Comparison',mainDesc:'Side-by-side legitimate vs suspicious AP analysis',sectionA:'Mismatch Details',sectionB:'All Detected APs',sectionC:'How It Works',start:'Scan',stop:'Stop',apsScanned:'APs Scanned',twinsDetected:'Twins Detected',mismatches:'Mismatches',noMismatches:'No mismatches detected yet',howItWorksText:'An evil twin is a rogue access point that copies the SSID of a legitimate network to trick users into connecting. While the SSID matches, other attributes often differ — MAC address, channel, encryption type, signal strength, and beacon interval. By comparing these attributes between APs with the same SSID, we can detect potential evil twins.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is an evil twin?',faq_a1:'A rogue AP that copies a legitimate SSID to intercept traffic.',faq_q2:'Is this real detection?',faq_a2:'No, this is a simulation.',faq_q3:'How are evil twins detected?',faq_a3:'By comparing MAC, channel, encryption, signal, beacon interval.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Click Scan to start.',howto_2:'Watch for twin comparisons.',howto_3:'Red rows show mismatches.',howto_4:'Check Mismatch Details.',wiki_twin_title:'Evil Twin',wiki_twin:'A rogue AP mimicking a legitimate network.',wiki_detect_title:'Detection',wiki_detect:'Compare BSSID, channel, encryption.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Evil Twin Spotter ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Scanning started',simStopped:'Scanning stopped',legitAP:'Legitimate AP detected',evilTwin:'EVIL TWIN DETECTED',safe:'All clear — no evil twins detected',danger:'ALERT: Evil twin detected! Attribute mismatches found.'},
fr:{title:'Detecteur Evil Twin — Verificateur AP',subtitle:'Detectez les points d\'acces malveillants',disconnected:'Deconnecte',connected:'Balayage',mainSection:'Comparaison AP',mainDesc:'Analyse cote a cote: legitime vs suspect',sectionA:'Details des Ecarts',sectionB:'Tous les AP Detectes',sectionC:'Comment ca marche',start:'Scanner',stop:'Arreter',apsScanned:'AP Scannes',twinsDetected:'Jumeaux Detectes',mismatches:'Ecarts',noMismatches:'Aucun ecart detecte',howItWorksText:'Un evil twin est un point d\'acces malveillant qui copie le SSID d\'un reseau legitime. En comparant les attributs (MAC, canal, chiffrement, signal), on peut detecter les jumeaux malveillants.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce qu\'un evil twin?',faq_a1:'Un AP malveillant copiant un SSID legitime.',faq_q2:'Detection reelle?',faq_a2:'Non, simulation.',faq_q3:'Comment detecter?',faq_a3:'Comparer MAC, canal, chiffrement.',faq_q4:'Donnees privees?',faq_a4:'Oui.',howto_1:'Cliquez Scanner.',howto_2:'Observez les comparaisons.',howto_3:'Les ecarts sont en rouge.',howto_4:'Verifiez les details.',wiki_twin_title:'Evil Twin',wiki_twin:'AP imitant un reseau legitime.',wiki_detect_title:'Detection',wiki_detect:'Comparer BSSID, canal, chiffrement.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Scan demarre',simStopped:'Scan arrete',legitAP:'AP legitime detecte',evilTwin:'EVIL TWIN DETECTE',safe:'Tout est clair',danger:'ALERTE: Evil twin detecte!'},
ar:{title:'كاشف التوأم الشرير — محقق AP',subtitle:'اكتشف نقاط الوصول المزيفة بمقارنة السمات',disconnected:'غير متصل',connected:'مسح',mainSection:'مقارنة AP',mainDesc:'تحليل جنباً إلى جنب: شرعي مقابل مشبوه',sectionA:'تفاصيل التباينات',sectionB:'جميع نقاط الوصول',sectionC:'كيف يعمل',start:'مسح',stop:'إيقاف',apsScanned:'AP ممسوحة',twinsDetected:'توائم مكتشفة',mismatches:'تباينات',noMismatches:'لا تباينات حتى الآن',howItWorksText:'التوأم الشرير هو نقطة وصول مزيفة تنسخ SSID لشبكة شرعية. بمقارنة السمات (MAC، القناة، التشفير، الإشارة) يمكننا كشف التوائم المزيفة.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو التوأم الشرير؟',faq_a1:'نقطة وصول مزيفة تنسخ SSID شبكة شرعية.',faq_q2:'هل هذا كشف حقيقي؟',faq_a2:'لا، محاكاة.',faq_q3:'كيف يتم الكشف؟',faq_a3:'بمقارنة MAC، القناة، التشفير.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم.',howto_1:'انقر مسح.',howto_2:'شاهد المقارنات.',howto_3:'التباينات بالأحمر.',howto_4:'تحقق من التفاصيل.',wiki_twin_title:'التوأم الشرير',wiki_twin:'AP يقلد شبكة شرعية.',wiki_detect_title:'الكشف',wiki_detect:'مقارنة BSSID، القناة، التشفير.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'كاشف التوأم الشرير جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ المسح',simStopped:'توقف المسح',legitAP:'AP شرعي',evilTwin:'توأم شرير مكتشف!',safe:'كل شيء آمن',danger:'تنبيه: توأم شرير!'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`evil-twin-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Evil Twin Spotter ═══════ */
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':')}
const SSIDS=['CoffeeShop_WiFi','Airport_Free','Hotel_Guest','CorpNet','Library_Public','Starbucks','HomeNet-5G'];
const ENCRYPTIONS=['WPA2-PSK','WPA3-SAE','WPA2-Enterprise','Open'];
const VENDORS=['Cisco','Ubiquiti','TP-Link','Netgear','Aruba','Ruckus'];

let simRunning=false,simInterval=null,allAPs=[],twinPairs=[],mismatchEntries=[],totalMismatches=0;

function genLegitAP(){
  return{ssid:SSIDS[Math.floor(Math.random()*SSIDS.length)],mac:randMAC(),channel:([1,6,11])[Math.floor(Math.random()*3)],encryption:ENCRYPTIONS[Math.floor(Math.random()*3)],signal:-30-Math.floor(Math.random()*30),beacon:100,vendor:VENDORS[Math.floor(Math.random()*VENDORS.length)],evil:false};
}
function genEvilTwin(legit){
  const twin={...legit,mac:randMAC(),evil:true};
  // Introduce subtle mismatches
  if(Math.random()>0.3)twin.channel=[1,6,11,3,9][Math.floor(Math.random()*5)];
  if(Math.random()>0.5)twin.encryption=ENCRYPTIONS[Math.floor(Math.random()*ENCRYPTIONS.length)];
  if(Math.random()>0.4)twin.signal=legit.signal+Math.floor(Math.random()*20)-5;
  if(Math.random()>0.6)twin.beacon=[100,102,200][Math.floor(Math.random()*3)];
  twin.vendor=VENDORS[Math.floor(Math.random()*VENDORS.length)];
  return twin;
}

function findMismatches(a,b){
  const mm=[];
  if(a.mac!==b.mac)mm.push({field:'BSSID',legit:a.mac,evil:b.mac});
  if(a.channel!==b.channel)mm.push({field:'Channel',legit:''+a.channel,evil:''+b.channel});
  if(a.encryption!==b.encryption)mm.push({field:'Encryption',legit:a.encryption,evil:b.encryption});
  if(Math.abs(a.signal-b.signal)>5)mm.push({field:'Signal',legit:a.signal+' dBm',evil:b.signal+' dBm'});
  if(a.beacon!==b.beacon)mm.push({field:'Beacon Interval',legit:a.beacon+'ms',evil:b.beacon+'ms'});
  if(a.vendor!==b.vendor)mm.push({field:'Vendor',legit:a.vendor,evil:b.vendor});
  return mm;
}

function renderRow(label,val,mismatch){
  return`<div class="twin-row${mismatch?' mismatch':''}"><span class="attr">${label}</span><span class="val">${val}</span></div>`;
}

function updateUI(){
  $('apScanned').textContent=allAPs.length;
  $('twinCount').textContent=twinPairs.length;
  $('mismatchCount').textContent=totalMismatches;

  const grid=$('twinGrid');
  if(grid&&twinPairs.length>0){
    const latest=twinPairs[twinPairs.length-1];
    const mm=latest.mismatches;
    const mmFields=new Set(mm.map(m=>m.field));
    grid.innerHTML=`
      <div class="twin-card legit"><div class="twin-label legit-label">✅ Legitimate AP</div>
        ${renderRow('SSID',latest.legit.ssid,false)}
        ${renderRow('BSSID',latest.legit.mac,mmFields.has('BSSID'))}
        ${renderRow('Channel',latest.legit.channel,mmFields.has('Channel'))}
        ${renderRow('Encryption',latest.legit.encryption,mmFields.has('Encryption'))}
        ${renderRow('Signal',latest.legit.signal+' dBm',mmFields.has('Signal'))}
        ${renderRow('Beacon',latest.legit.beacon+'ms',mmFields.has('Beacon Interval'))}
        ${renderRow('Vendor',latest.legit.vendor,mmFields.has('Vendor'))}
      </div>
      <div class="twin-card evil"><div class="twin-label evil-label">🚨 Suspected Evil Twin</div>
        ${renderRow('SSID',latest.evil.ssid,false)}
        ${renderRow('BSSID',latest.evil.mac,mmFields.has('BSSID'))}
        ${renderRow('Channel',latest.evil.channel,mmFields.has('Channel'))}
        ${renderRow('Encryption',latest.evil.encryption,mmFields.has('Encryption'))}
        ${renderRow('Signal',latest.evil.signal+' dBm',mmFields.has('Signal'))}
        ${renderRow('Beacon',latest.evil.beacon+'ms',mmFields.has('Beacon Interval'))}
        ${renderRow('Vendor',latest.evil.vendor,mmFields.has('Vendor'))}
      </div>`;
  }

  // Alert
  const box=$('alertBox'),msg=$('alertMsg');
  const s=LANG[currentLang];
  if(twinPairs.length>0){box.className='alert-box active danger';msg.textContent='🚨 '+s.danger}
  else if(allAPs.length>0){box.className='alert-box active safe';msg.textContent='✅ '+s.safe}

  // Mismatch list
  const ml=$('mismatchList');
  if(ml){
    if(mismatchEntries.length===0)ml.innerHTML=`<em>${s.noMismatches}</em>`;
    else ml.innerHTML=mismatchEntries.map(e=>`<div class="mismatch-entry"><span class="field">${e.field}</span><span>Legit: ${e.legit}</span><span>Evil: ${e.evil}</span></div>`).join('');
  }

  // All APs
  const al=$('allAPList');
  if(al){
    al.innerHTML=allAPs.map(a=>`<div style="padding:3px 0;border-bottom:1px solid var(--border);display:flex;gap:8px"><span style="color:${a.evil?'#ef4444':'#22c55e'}">${a.evil?'🚨':'✅'}</span><span style="font-family:monospace;font-size:.68rem">${a.mac}</span><span>${a.ssid}</span><span style="color:var(--text-muted)">Ch${a.channel} ${a.encryption} ${a.signal}dBm</span></div>`).join('');
  }
}

function addAP(){
  const s=LANG[currentLang];
  const legit=genLegitAP();
  allAPs.push(legit);
  log(`${s.legitAP}: ${legit.ssid} (${legit.mac})`,'rx');

  // 30% chance of evil twin
  if(Math.random()<0.3){
    const evil=genEvilTwin(legit);
    allAPs.push(evil);
    const mm=findMismatches(legit,evil);
    twinPairs.push({legit,evil,mismatches:mm});
    mismatchEntries.push(...mm);
    totalMismatches+=mm.length;
    log(`${s.evilTwin}: ${evil.ssid} (${evil.mac}) — ${mm.length} mismatches`,'error');
  }
  updateUI();
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  allAPs=[];twinPairs=[];mismatchEntries=[];totalMismatches=0;
  log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(addAP,2000);
}
function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
