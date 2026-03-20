/**
 * imp-rogue-charger-lab — Workshop DIY
 * Rogue charger / juice jacking simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="20" width="40" height="55" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><rect x="40" y="10" width="20" height="15" rx="2" fill="currentColor" opacity=".3"/><line x1="50" y1="35" x2="50" y2="55" stroke="currentColor" stroke-width="3"/><line x1="42" y1="45" x2="58" y2="45" stroke="currentColor" stroke-width="3"/><path d="M35 80 L50 65 L65 80" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const now=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,now+0.08);o.start(now);o.stop(now+0.08)}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,now+0.3);o.start(now);o.stop(now+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,now+0.25);o.start(now);o.stop(now+0.25)}}
const LANG={en:{title:'imp-rogue-charger-lab',subtitle:'🔋 charge · 🕵️ extract · 🛡️ protect',disconnected:'Disconnected',connected:'Connected',ready:'🔋 Rogue Charger Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},fr:{title:'imp-rogue-charger-lab',subtitle:'🔋 charger · 🕵️ extraire · 🛡️ protéger',disconnected:'Déconnecté',connected:'Connecté',ready:'🔋 Labo chargeur piège prêt!',logCleared:'Journal effacé',copied:'Copié!',working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},ar:{title:'imp-rogue-charger-lab',subtitle:'🔋 شحن · 🕵️ استخراج · 🛡️ حماية',disconnected:'غير متصل',connected:'متصل',ready:'🔋 مختبر الشاحن المزيف جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.'}};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}log(`${LANG[currentLang].themeChanged} ${n}`,'info')}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click()}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter()})})}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}function closePanel(p,o){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}function openSettings(){openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(i){const el=$('answer'+i);if(el)el.classList.toggle('visible');playSound('click')}

/* ═══════ ROGUE CHARGER SIM ═══════ */
let particles=[];
function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;
  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    const type=($('chargerTypeSelect')||{}).value||'data-theft';
    // Charger body
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(30,40,120,160);
    ctx.fillStyle=accent;ctx.font='10px Orbitron';ctx.fillText('CHARGER',50,130);
    // Phone
    ctx.strokeStyle='#4488ff';ctx.strokeRect(canvas.width-150,60,100,140);
    ctx.fillStyle='#4488ff';ctx.fillText('PHONE',canvas.width-130,140);
    // USB cable
    ctx.strokeStyle=type==='power-only'?'#33ff33':'#ff3333';ctx.lineWidth=3;ctx.setLineDash([6,4]);
    ctx.beginPath();ctx.moveTo(150,120);ctx.lineTo(canvas.width-150,120);ctx.stroke();ctx.setLineDash([]);
    // Power line (always)
    ctx.strokeStyle='#ffaa00';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(150,100);ctx.lineTo(canvas.width-150,100);ctx.stroke();
    ctx.fillStyle='#ffaa00';ctx.font='8px Orbitron';ctx.fillText('VCC',160,96);
    // Data lines
    if(type!=='power-only'){
      ctx.strokeStyle='#ff3333';ctx.beginPath();ctx.moveTo(150,140);ctx.lineTo(canvas.width-150,140);ctx.stroke();
      ctx.fillStyle='#ff3333';ctx.fillText('D+/D-',160,136);
      ctx.fillText('⚠️ DATA ACTIVE',canvas.width/2-40,canvas.height-20);
    }else{ctx.fillStyle='#33ff33';ctx.fillText('✅ POWER ONLY',canvas.width/2-40,canvas.height-20)}
    // Particles
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.life-=0.015;if(p.life<=0||p.x>canvas.width){particles.splice(i,1);continue}ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();ctx.globalAlpha=1}
    // Charge bar
    const rate=parseInt(($('chargeSlider')||{}).value||'50');
    ctx.fillStyle='rgba(255,170,0,0.2)';ctx.fillRect(30,210,(canvas.width-60)*(rate/100),10);
    requestAnimationFrame(draw);
  }draw();
}
function spawnParticles(n,c){for(let i=0;i<n;i++)particles.push({x:150+Math.random()*20,y:100+Math.random()*50,vx:2+Math.random()*3,life:0.5+Math.random()*0.5,color:c||'#ff3333'})}

function initChargerSim(){
  const chargeSlider=$('chargeSlider'),chargeValue=$('chargeValue');
  if(chargeSlider&&chargeValue)chargeSlider.addEventListener('input',()=>{chargeValue.textContent=chargeSlider.value+'W'});
  const plugBtn=$('plugBtn'),analyzeBtn=$('analyzeBtn'),blockBtn=$('blockBtn');
  if(plugBtn)plugBtn.addEventListener('click',()=>{
    const type=($('chargerTypeSelect')||{}).value;const dot=$('implantDot'),txt=$('implantStatusText');
    if(dot)dot.classList.add('active');if(txt)txt.textContent='Charger: CONNECTED';setStatus(true);
    log(`🔌 Device plugged into ${type} charger`,'info');spawnParticles(20,type==='power-only'?'#33ff33':'#ff3333');
    showToast('Device connected...',1500);
    if(type==='data-theft'){setTimeout(()=>{log('🚨 DATA EXFILTRATION DETECTED — photos, contacts being copied!','error');if($('outputDisplay'))$('outputDisplay').textContent='⚠️ JUICE JACKING ACTIVE\nData lines: ACTIVE\nExfiltrating: contacts.vcf, photos/\nRate: 2.4 MB/s'},1500)}
    else if(type==='malware-inject'){setTimeout(()=>{log('🚨 MALWARE INJECTION — payload being pushed to device!','error');if($('outputDisplay'))$('outputDisplay').textContent='⚠️ MALWARE INJECTION\nPayload: rootkit.apk\nVector: ADB sideload\nStatus: Installing...'},1500)}
    else{setTimeout(()=>{log('✅ Safe power-only charging — no data transfer','success');if($('outputDisplay'))$('outputDisplay').textContent='✅ SAFE CHARGING\nData lines: DISCONNECTED\nPower: '+($('chargeSlider')||{}).value+'W\nStatus: Charging safely'},1000)}
  });
  if(analyzeBtn)analyzeBtn.addEventListener('click',()=>{
    showToast('Analyzing USB lines...',2000);log('🔬 Analyzing charger USB lines...','info');
    setTimeout(()=>{const type=($('chargerTypeSelect')||{}).value;const safe=type==='power-only';
      if($('outputDisplay'))$('outputDisplay').textContent=safe?'✅ LINE ANALYSIS\nD+: 0.00V (disconnected)\nD-: 0.00V (disconnected)\nVCC: 5.0V\nVerdict: SAFE':'⚠️ LINE ANALYSIS\nD+: 3.3V (ACTIVE)\nD-: 3.3V (ACTIVE)\nVCC: 5.0V\nVerdict: COMPROMISED';
      log(safe?'✅ Lines clean':'🚨 Data lines active!',safe?'success':'error')},1500);
  });
  if(blockBtn)blockBtn.addEventListener('click',()=>{
    log('🛡️ USB data blocker activated — D+/D- severed','success');
    if($('outputDisplay'))$('outputDisplay').textContent='🛡️ DATA BLOCKER ACTIVE\nD+: BLOCKED\nD-: BLOCKED\nVCC: PASS-THROUGH\nCharging: Safe mode';
    showToast('Data lines blocked!',1500);
  });
  const scanBtn=$('scanChargerBtn');if(scanBtn)scanBtn.addEventListener('click',()=>{spawnParticles(25,'#4488ff');log('📡 Charger scan initiated','info');showToast('Scanning...',2000)});
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn')&&($('clearLogBtn').onclick=clearLog);$('copyLogBtn')&&($('copyLogBtn').onclick=copyLog);$('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);initLogFilters();
  $('helpBtn')&&($('helpBtn').onclick=openHelp);$('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp);$('helpOverlay')&&($('helpOverlay').onclick=closeHelp);initHelpTabs();
  $('settingsBtn')&&($('settingsBtn').onclick=openSettings);$('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings);$('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);
  $('logBtn')&&($('logBtn').onclick=toggleLog);$('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);
  const snd=$('soundToggle');if(snd){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}snd.checked=soundEnabled;snd.addEventListener('change',()=>{soundEnabled=snd.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate();initSimCanvas();initChargerSim();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
