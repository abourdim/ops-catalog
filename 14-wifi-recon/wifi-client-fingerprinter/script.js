/**
 * Client Fingerprinter — Device ID
 * Fingerprint table, uniqueness score
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}

const LANG={
en:{title:'Client Fingerprinter — Device ID',subtitle:'Identify devices by their wireless behavior',disconnected:'Disconnected',connected:'Fingerprinting',mainSection:'Fingerprint Table',mainDesc:'Device identification via wireless behavioral analysis',sectionA:'Vendor Distribution',sectionB:'Fingerprint Details',sectionC:'How It Works',start:'Scan',stop:'Stop',devices:'Devices',avgUniqueness:'Avg Uniqueness',vendors:'Vendors',osTypes:'OS Types',colMAC:'MAC',colVendor:'Vendor',colOS:'OS',colProbeCount:'Probes',colHTCaps:'HT Caps',colUniqueness:'Uniqueness',clickDevice:'Click a device row for fingerprint details',howItWorksText:'Client fingerprinting identifies WiFi devices by analyzing their unique behavioral patterns — probe request sequences, supported data rates (HT capabilities), power management flags, and timing intervals. Even with MAC randomization, the combination of these attributes creates a fingerprint that can be used to track and identify devices. The uniqueness score indicates how distinguishable a device is from others in the environment.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is client fingerprinting?',faq_a1:'Identifying WiFi devices by unique behavioral patterns and capabilities.',faq_q2:'Is this real fingerprinting?',faq_a2:'No, this is a simulation.',faq_q3:'What makes a fingerprint unique?',faq_a3:'Probe sequences, HT capabilities, supported rates, and timing patterns.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Click Scan to begin fingerprinting.',howto_2:'Watch devices appear with uniqueness scores.',howto_3:'Check Vendor Distribution for breakdown.',howto_4:'Click a device row for detailed fingerprint.',wiki_fp_title:'Fingerprinting',wiki_fp:'Device identification through passive WiFi analysis.',wiki_ht_title:'HT Capabilities',wiki_ht:'High Throughput caps reveal chipset and driver info.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Client Fingerprinter ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Fingerprinting started',simStopped:'Fingerprinting stopped',newDevice:'New device fingerprinted'},
fr:{title:'Empreinte Client — Identification',subtitle:'Identifiez les appareils par leur comportement sans fil',disconnected:'Deconnecte',connected:'Empreinte',mainSection:'Table d\'Empreintes',mainDesc:'Identification par analyse comportementale',sectionA:'Distribution des Fabricants',sectionB:'Details de l\'Empreinte',sectionC:'Comment ca marche',start:'Scanner',stop:'Arreter',devices:'Appareils',avgUniqueness:'Unicite Moy.',vendors:'Fabricants',osTypes:'Types OS',colMAC:'MAC',colVendor:'Fabricant',colOS:'OS',colProbeCount:'Sondes',colHTCaps:'Caps HT',colUniqueness:'Unicite',clickDevice:'Cliquez un appareil pour les details',howItWorksText:'L\'empreinte client identifie les appareils WiFi par leurs comportements uniques — sequences de sondes, capacites HT, drapeaux de gestion d\'energie. Meme avec la randomisation MAC, ces attributs creent une empreinte identifiable.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que l\'empreinte client?',faq_a1:'Identification par comportement sans fil.',faq_q2:'Empreinte reelle?',faq_a2:'Non, simulation.',faq_q3:'Qu\'est-ce qui rend une empreinte unique?',faq_a3:'Sequences de sondes, capacites HT, taux supportes.',faq_q4:'Donnees privees?',faq_a4:'Oui.',howto_1:'Cliquez Scanner.',howto_2:'Observez les scores d\'unicite.',howto_3:'Verifiez la distribution.',howto_4:'Cliquez un appareil.',wiki_fp_title:'Empreinte',wiki_fp:'Identification passive par WiFi.',wiki_ht_title:'Capacites HT',wiki_ht:'Revelent les infos du chipset.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Empreinte demarree',simStopped:'Arretee',newDevice:'Nouvel appareil'},
ar:{title:'بصمة العميل — تعريف الجهاز',subtitle:'حدد الأجهزة من سلوكها اللاسلكي',disconnected:'غير متصل',connected:'بصمة',mainSection:'جدول البصمات',mainDesc:'تعريف الأجهزة عبر التحليل السلوكي',sectionA:'توزيع الشركات المصنعة',sectionB:'تفاصيل البصمة',sectionC:'كيف يعمل',start:'مسح',stop:'إيقاف',devices:'أجهزة',avgUniqueness:'متوسط التفرد',vendors:'شركات',osTypes:'أنظمة تشغيل',colMAC:'MAC',colVendor:'الشركة',colOS:'النظام',colProbeCount:'استكشافات',colHTCaps:'قدرات HT',colUniqueness:'التفرد',clickDevice:'انقر صف جهاز للتفاصيل',howItWorksText:'بصمة العميل تحدد أجهزة WiFi بتحليل أنماطها السلوكية الفريدة — تسلسلات الاستكشاف، معدلات البيانات المدعومة، أعلام إدارة الطاقة. حتى مع عشوائية MAC، مجموعة هذه السمات تنشئ بصمة يمكن تتبعها.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هي بصمة العميل؟',faq_a1:'تعريف الأجهزة بأنماطها الفريدة.',faq_q2:'هل هذه بصمة حقيقية؟',faq_a2:'لا، محاكاة.',faq_q3:'ما الذي يجعل البصمة فريدة؟',faq_a3:'تسلسلات الاستكشاف، قدرات HT.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم.',howto_1:'انقر مسح.',howto_2:'شاهد درجات التفرد.',howto_3:'تحقق من التوزيع.',howto_4:'انقر صف جهاز.',wiki_fp_title:'البصمة',wiki_fp:'تعريف سلبي عبر WiFi.',wiki_ht_title:'قدرات HT',wiki_ht:'تكشف معلومات الشريحة.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'بصمة العميل جاهزة!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأت البصمة',simStopped:'توقفت',newDevice:'جهاز جديد'}
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
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`fingerprint-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
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

/* ═══════ APP LOGIC — Client Fingerprinter ═══════ */
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':')}
const VENDORS=['Apple','Samsung','Google','Huawei','Xiaomi','OnePlus','Intel','Dell','HP','Lenovo','Sony','LG','Motorola','Nokia'];
const OS_TYPES=['iOS 17','iOS 16','Android 14','Android 13','Android 12','Windows 11','Windows 10','macOS 14','Linux','ChromeOS'];
const HT_CAPS=['HT20','HT40','HT20/HT40','VHT80','VHT160','HE80','HE160'];
const RATES=['6,9,12,18,24,36,48,54','1,2,5.5,11','6,12,24','6,9,12,18,24,36,48,54,MCS0-7','MCS0-9,VHT'];

let simRunning=false,simInterval=null,devices=[];

function genDevice(){
  const vendor=VENDORS[Math.floor(Math.random()*VENDORS.length)];
  const os=OS_TYPES[Math.floor(Math.random()*OS_TYPES.length)];
  const ht=HT_CAPS[Math.floor(Math.random()*HT_CAPS.length)];
  const rates=RATES[Math.floor(Math.random()*RATES.length)];
  const probes=Math.floor(Math.random()*20)+1;
  const uniqueness=Math.floor(Math.random()*60)+40;
  return{mac:randMAC(),vendor,os,ht,rates,probes,uniqueness,
    powerSave:Math.random()>0.5,wmm:Math.random()>0.3,
    interval:Math.floor(Math.random()*100)+50+'ms'};
}

function uniqColor(v){if(v>=80)return'#ef4444';if(v>=60)return'#fbbf24';return'#22c55e'}

function updateUI(){
  const tbody=$('fpBody');
  if(tbody){
    tbody.innerHTML='';
    devices.forEach((d,i)=>{
      const tr=document.createElement('tr');
      tr.style.cursor='pointer';
      tr.onclick=()=>showFPDetail(d);
      const c=uniqColor(d.uniqueness);
      tr.innerHTML=`<td style="font-family:monospace;font-size:.68rem">${d.mac}</td><td>${d.vendor}</td><td>${d.os}</td><td>${d.probes}</td><td style="font-size:.66rem">${d.ht}</td><td><div class="uniqueness-bar"><div class="uniqueness-fill" style="width:${d.uniqueness}%;background:${c}"></div></div><span style="font-size:.65rem;color:${c}">${d.uniqueness}%</span></td>`;
      tbody.appendChild(tr);
    });
  }
  $('deviceCount').textContent=devices.length;
  const avg=devices.length>0?Math.round(devices.reduce((s,d)=>s+d.uniqueness,0)/devices.length):0;
  $('avgUniq').textContent=avg+'%';
  const vendorSet=new Set(devices.map(d=>d.vendor));$('vendorCount').textContent=vendorSet.size;
  const osSet=new Set(devices.map(d=>d.os));$('osCount').textContent=osSet.size;

  // Vendor dist
  const vd=$('vendorDist');
  if(vd){
    const counts={};devices.forEach(d=>{counts[d.vendor]=(counts[d.vendor]||0)+1});
    const max=Math.max(...Object.values(counts),1);
    vd.innerHTML=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([v,c])=>{
      const pct=Math.round(c/devices.length*100);
      return`<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="min-width:80px;font-weight:600">${v}</span><div style="flex:1;height:8px;border-radius:4px;background:rgba(0,0,0,.3)"><div style="height:100%;width:${c/max*100}%;background:var(--accent);border-radius:4px"></div></div><span style="min-width:40px;text-align:right">${c} (${pct}%)</span></div>`;
    }).join('');
  }
}

function showFPDetail(d){
  const el=$('fpDetail');if(!el)return;
  el.innerHTML=`<strong style="color:var(--accent)">${d.mac}</strong> — ${d.vendor} ${d.os}<br>
    <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">
      <span class="fp-tag" style="background:var(--accent);color:var(--bg)">Uniqueness: ${d.uniqueness}%</span>
      <span class="fp-tag">HT: ${d.ht}</span>
      <span class="fp-tag">Rates: ${d.rates}</span>
      <span class="fp-tag">Probes: ${d.probes}</span>
      <span class="fp-tag">PowerSave: ${d.powerSave?'Yes':'No'}</span>
      <span class="fp-tag">WMM: ${d.wmm?'Yes':'No'}</span>
      <span class="fp-tag">Interval: ${d.interval}</span>
    </div>`;
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  devices=[];log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(()=>{
    const d=genDevice();devices.push(d);
    log(`${LANG[currentLang].newDevice}: ${d.mac} (${d.vendor} ${d.os}) — ${d.uniqueness}%`,'rx');
    updateUI();
  },1500);
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

/* ═══════ RICH CANVAS SIMULATION — Fingerprint Constellation ═══════ */
(function fingerprintCanvas(){
  const CVS_ID='fingerprintVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">🔬</span> Fingerprint Constellation</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:280px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const nodes=[];let _raf=null,frameCount=0;
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    frameCount++;
    // Sync with devices array
    if(typeof devices!=='undefined'){
      while(nodes.length<devices.length&&nodes.length<50){
        const d=devices[nodes.length];
        const angle=Math.random()*Math.PI*2;const dist=0.15+Math.random()*0.32;
        nodes.push({x:w/2+Math.cos(angle)*dist*w,y:h/2+Math.sin(angle)*dist*h,
          vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,
          uniq:d?d.uniqueness:50,vendor:d?d.vendor:'Unknown',
          pulsePhase:Math.random()*Math.PI*2,r:4+Math.random()*4});
      }
    }
    // Draw connections between similar nodes
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.strokeStyle=`rgba(168,85,247,${(1-dist/120)*0.15})`;ctx.lineWidth=0.5;ctx.stroke();
        }
      }
    }
    // Draw nodes
    nodes.forEach((n,i)=>{
      n.x+=n.vx;n.y+=n.vy;
      if(n.x<30||n.x>w-30)n.vx*=-1;if(n.y<30||n.y>h-30)n.vy*=-1;
      n.vx+=(Math.random()-0.5)*0.05;n.vy+=(Math.random()-0.5)*0.05;
      n.vx*=0.99;n.vy*=0.99;
      const pulse=Math.sin(frameCount*0.03+n.pulsePhase)*0.3+0.7;
      const color=n.uniq>=80?'#ef4444':n.uniq>=60?'#fbbf24':'#22c55e';
      // Glow
      const grad=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*3*pulse);
      grad.addColorStop(0,color+'40');grad.addColorStop(1,color+'00');
      ctx.fillStyle=grad;ctx.fillRect(n.x-n.r*3,n.y-n.r*3,n.r*6,n.r*6);
      // Core
      ctx.beginPath();ctx.arc(n.x,n.y,n.r*pulse,0,Math.PI*2);ctx.fillStyle=color+'cc';ctx.fill();
      ctx.strokeStyle=color+'40';ctx.lineWidth=1;ctx.stroke();
      // Uniqueness ring
      ctx.beginPath();ctx.arc(n.x,n.y,n.r*1.8,0,Math.PI*2*(n.uniq/100));
      ctx.strokeStyle=color+'80';ctx.lineWidth=2;ctx.lineCap='round';ctx.stroke();
      // Label
      if(nodes.length<25){
        ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.4)';ctx.textAlign='center';
        ctx.fillText(n.vendor,n.x,n.y+n.r*2.5);
        ctx.fillText(n.uniq+'%',n.x,n.y+n.r*2.5+9);
      }
    });
    // Legend
    ctx.font='9px monospace';ctx.textAlign='left';
    [['#22c55e','Low <60%'],['#fbbf24','Med 60-80%'],['#ef4444','High >80%']].forEach(([c,l],i)=>{
      ctx.fillStyle=c;ctx.beginPath();ctx.arc(12,15+i*14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillText(l,20,18+i*14);
    });
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
