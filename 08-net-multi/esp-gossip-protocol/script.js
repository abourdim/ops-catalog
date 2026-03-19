/**
 * Workshop DIY — Gossip Protocol v1.0
 * Epidemic data spreading simulation
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8zM330.8,203.4h-169.1v3.6h169.1zM330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}}

const LANG={
en:{
title:'Gossip Protocol',subtitle:'💬 gossip · 🦠 epidemic · 📊 convergence',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Gossip Protocol — Epidemic Spread',mainDesc:'Data spreads like infection through the network',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is a gossip protocol?',faq_a1:'A gossip protocol spreads information through a network like a rumor. Each node tells random neighbors, and the data eventually reaches everyone.',
faq_q2:'Why is it called epidemic?',faq_a2:'The spreading pattern resembles how diseases spread: one infected node infects neighbors, who infect their neighbors, exponentially.',
faq_q3:'What is convergence?',faq_a3:'Convergence is when all nodes have received the data. The protocol converges when infection reaches 100%.',
faq_q4:'Where is gossip used?',faq_a4:'Gossip protocols are used in distributed databases (Cassandra), blockchain networks, cluster membership, and failure detection.',
howto_1:'Click a node or press Seed Node to start the gossip.',
howto_2:'Watch as infected nodes spread data to neighbors each round.',
howto_3:'Adjust the spread probability slider to control infection chance.',
howto_4:'Monitor the stats: round count, infected nodes, and convergence.',
wiki_gossip_title:'💬 Gossip Protocols',wiki_gossip:'Gossip (epidemic) protocols achieve eventual consistency by random peer-to-peer information exchange.',
wiki_epidemic_title:'🦠 Epidemic Models',wiki_epidemic:'SI model: once infected, a node stays infected and keeps spreading. SIR adds recovery.',
wiki_convergence_title:'📊 Convergence',wiki_convergence:'Gossip converges in O(log N) rounds for N nodes, making it very efficient.',
wiki_apps_title:'🔧 Applications',wiki_apps:'Used in Cassandra, DynamoDB, Bitcoin network, and Kubernetes cluster management.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'💬 Gossip Protocol ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
nodesLabel:'Nodes:',probLabel:'Spread %:',seedBtn:'Seed Node',resetBtn:'Reset',
statRound:'Round',statInfected:'Infected',statTotal:'Total',statConverged:'Converged',
step1:'One node is "seeded" with data (infected). It knows information that others do not.',
step2:'Each round, every infected node randomly picks a neighbor and shares the data.',
step3:'The neighbor becomes infected with a probability based on the spread percentage.',
step4:'After enough rounds, all nodes converge — everyone has the data.',
labTip1:'Click any node on the canvas to seed it with data.',
labTip2:'Adjust the spread probability to see how it affects convergence speed.',
labTip3:'Try with few nodes (6) vs many (25) to compare behavior.',
labTip4:'Watch the timeline bar fill up as more nodes get infected.',
challenge1:'Achieve 100% convergence in the fewest rounds. What probability is needed?',
challenge2:'Set spread to 10% and observe rounds vs 90%.',
challenge3:'With 25 nodes, predict rounds to convergence at 50%.',
seeded:'Node {id} seeded with data',roundN:'Round {n}',spread:'→ gossips to',infected:'infected!',alreadyHas:'already has data',converged:'All nodes converged!',yes:'Yes',no:'No',
},
fr:{
title:'Protocole Gossip',subtitle:'💬 rumeur · 🦠 épidémie · 📊 convergence',
disconnected:'Déconnecté',connected:'Connecté',
mainSection:'Protocole Gossip — Propagation Épidémique',mainDesc:'Les données se propagent comme une infection à travers le réseau',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce qu\'un protocole gossip ?',faq_a1:'Un protocole gossip propage l\'information comme une rumeur. Chaque nœud informe des voisins aléatoires.',
faq_q2:'Pourquoi épidémique ?',faq_a2:'Le schéma de propagation ressemble aux maladies : un nœud infecté propage à ses voisins exponentiellement.',
faq_q3:'Qu\'est-ce que la convergence ?',faq_a3:'La convergence est quand tous les nœuds ont reçu les données.',
faq_q4:'Où est utilisé le gossip ?',faq_a4:'Dans Cassandra, les blockchains, la gestion de clusters et la détection de pannes.',
howto_1:'Cliquez sur un nœud ou appuyez sur Semer pour démarrer.',howto_2:'Regardez les nœuds infectés propager les données.',
howto_3:'Ajustez la probabilité de propagation.',howto_4:'Suivez les statistiques et la convergence.',
wiki_gossip_title:'💬 Protocoles Gossip',wiki_gossip:'Les protocoles gossip atteignent la cohérence éventuelle par échange aléatoire pair-à-pair.',
wiki_epidemic_title:'🦠 Modèles Épidémiques',wiki_epidemic:'Modèle SI : une fois infecté, un nœud reste infecté et continue de propager.',
wiki_convergence_title:'📊 Convergence',wiki_convergence:'Le gossip converge en O(log N) tours pour N nœuds.',
wiki_apps_title:'🔧 Applications',wiki_apps:'Utilisé dans Cassandra, DynamoDB, Bitcoin et Kubernetes.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'💬 Protocole Gossip prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
nodesLabel:'Nœuds :',probLabel:'Propagation % :',seedBtn:'Semer',resetBtn:'Réinitialiser',
statRound:'Tour',statInfected:'Infectés',statTotal:'Total',statConverged:'Convergé',
step1:'Un nœud est "semé" avec des données (infecté).',step2:'Chaque tour, les nœuds infectés partagent avec un voisin aléatoire.',
step3:'Le voisin est infecté selon la probabilité de propagation.',step4:'Après assez de tours, tous convergent.',
labTip1:'Cliquez sur un nœud pour le semer.',labTip2:'Ajustez la probabilité pour voir l\'effet.',
labTip3:'Comparez 6 nœuds vs 25.',labTip4:'Regardez la barre de progression.',
challenge1:'Convergence 100% en minimum de tours. Quelle probabilité ?',
challenge2:'10% de propagation vs 90% : combien de tours ?',
challenge3:'25 nœuds à 50% : prédisez les tours.',
seeded:'Nœud {id} semé',roundN:'Tour {n}',spread:'→ parle à',infected:'infecté !',alreadyHas:'a déjà les données',converged:'Tous les nœuds ont convergé !',yes:'Oui',no:'Non',
},
ar:{
title:'بروتوكول الثرثرة',subtitle:'💬 ثرثرة · 🦠 وبائي · 📊 تقارب',
disconnected:'غير متصل',connected:'متصل',
mainSection:'بروتوكول الثرثرة — انتشار وبائي',mainDesc:'البيانات تنتشر كالعدوى عبر الشبكة',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
faq_q1:'ما هو بروتوكول الثرثرة؟',faq_a1:'بروتوكول الثرثرة ينشر المعلومات كالشائعة. كل عقدة تخبر جيرانًا عشوائيين.',
faq_q2:'لماذا يسمى وبائيًا؟',faq_a2:'نمط الانتشار يشبه الأمراض: عقدة مصابة تنقل العدوى لجيرانها بشكل متسارع.',
faq_q3:'ما هو التقارب؟',faq_a3:'التقارب هو عندما تحصل جميع العقد على البيانات.',
faq_q4:'أين يُستخدم؟',faq_a4:'في Cassandra وشبكات البلوكتشين وإدارة المجموعات وكشف الأعطال.',
howto_1:'انقر على عقدة أو اضغط بذر لبدء الثرثرة.',howto_2:'شاهد العقد المصابة تنشر البيانات.',
howto_3:'اضبط احتمال الانتشار.',howto_4:'تابع الإحصائيات والتقارب.',
wiki_gossip_title:'💬 بروتوكولات الثرثرة',wiki_gossip:'تحقق بروتوكولات الثرثرة الاتساق النهائي عبر تبادل عشوائي.',
wiki_epidemic_title:'🦠 النماذج الوبائية',wiki_epidemic:'نموذج SI: العقدة المصابة تبقى مصابة وتستمر بالنشر.',
wiki_convergence_title:'📊 التقارب',wiki_convergence:'الثرثرة تتقارب في O(log N) جولة لـ N عقدة.',
wiki_apps_title:'🔧 التطبيقات',wiki_apps:'يُستخدم في Cassandra وDynamoDB وبيتكوين وKubernetes.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'💬 بروتوكول الثرثرة جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
nodesLabel:'العقد:',probLabel:'نسبة الانتشار:',seedBtn:'بذر عقدة',resetBtn:'إعادة',
statRound:'الجولة',statInfected:'مصابة',statTotal:'المجموع',statConverged:'متقاربة',
step1:'عقدة واحدة تُبذر بالبيانات (مصابة).',step2:'كل جولة، كل عقدة مصابة تختار جارًا عشوائيًا وتشارك البيانات.',
step3:'الجار يُصاب بنسبة احتمال معينة.',step4:'بعد جولات كافية، تتقارب جميع العقد.',
labTip1:'انقر على أي عقدة لبذرها.',labTip2:'اضبط الاحتمال لمشاهدة التأثير.',
labTip3:'قارن 6 عقد مع 25.',labTip4:'شاهد شريط التقدم.',
challenge1:'تقارب 100% بأقل جولات. ما الاحتمال المطلوب؟',
challenge2:'10% مقابل 90%: كم جولة؟',
challenge3:'25 عقدة بنسبة 50%: توقع الجولات.',
seeded:'العقدة {id} بُذرت',roundN:'الجولة {n}',spread:'→ يثرثر مع',infected:'أُصيب!',alreadyHas:'لديه البيانات بالفعل',converged:'جميع العقد تقاربت!',yes:'نعم',no:'لا',
}};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');updateStats();}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const ns=THEME_MELODIES[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tgt=$('help'+n.charAt(0).toUpperCase()+n.slice(1));if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* ═══════ GOSSIP SIMULATION ═══════ */

const G = {
  nodes: [], canvas: null, ctx: null, round: 0, running: false, interval: null,
  spreadProb: 0.6, linkRange: 140,
  anims: [], // {fromId, toId, progress, success}
};

class GNode {
  constructor(id, x, y) {
    this.id = id; this.x = x; this.y = y;
    this.infected = false;
    this.neighbors = [];
    this.pulseTime = 0;
  }
}

function gossipInit() {
  G.canvas = $('gossipCanvas'); if (!G.canvas) return;
  G.ctx = G.canvas.getContext('2d');
  gossipResize(); window.addEventListener('resize', gossipResize);

  G.canvas.addEventListener('click', e => {
    const r = G.canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const node = G.nodes.find(n => Math.hypot(n.x - mx, n.y - my) < 16);
    if (node && !node.infected) seedNode(node.id);
  });

  const nodeSlider = $('nodeSlider'), nodeVal = $('nodeVal');
  if (nodeSlider) nodeSlider.addEventListener('input', () => {
    if (nodeVal) nodeVal.textContent = nodeSlider.value;
    gossipReset(parseInt(nodeSlider.value));
  });

  const probSlider = $('probSlider'), probVal = $('probVal');
  if (probSlider) probSlider.addEventListener('input', () => {
    G.spreadProb = parseInt(probSlider.value) / 100;
    if (probVal) probVal.textContent = probSlider.value + '%';
  });

  const seedBtn = $('seedBtn');
  if (seedBtn) seedBtn.addEventListener('click', () => {
    const uninfected = G.nodes.filter(n => !n.infected);
    if (uninfected.length > 0) seedNode(uninfected[Math.floor(Math.random() * uninfected.length)].id);
  });

  const resetBtn = $('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => gossipReset(G.nodes.length));

  gossipReset(12);
  gossipRender();
}

function gossipResize() {
  if (!G.canvas) return;
  const r = G.canvas.parentElement.getBoundingClientRect();
  G.canvas.width = r.width - 2; G.canvas.height = 300;
}

function gossipReset(count) {
  if (G.interval) { clearInterval(G.interval); G.interval = null; }
  G.running = false; G.round = 0; G.anims = [];
  G.nodes = [];
  const w = G.canvas ? G.canvas.width : 400, h = G.canvas ? G.canvas.height : 300;
  for (let i = 0; i < count; i++) {
    G.nodes.push(new GNode(i, 30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60)));
  }
  rebuildLinks();
  updateStats();
}

function rebuildLinks() {
  G.nodes.forEach(n => n.neighbors = []);
  for (let i = 0; i < G.nodes.length; i++) {
    for (let j = i + 1; j < G.nodes.length; j++) {
      if (Math.hypot(G.nodes[i].x - G.nodes[j].x, G.nodes[i].y - G.nodes[j].y) < G.linkRange) {
        G.nodes[i].neighbors.push(j);
        G.nodes[j].neighbors.push(i);
      }
    }
  }
  // Ensure connected: connect isolated nodes to nearest
  G.nodes.forEach((n, i) => {
    if (n.neighbors.length === 0) {
      let minD = Infinity, minJ = -1;
      G.nodes.forEach((m, j) => { if (i !== j) { const d = Math.hypot(n.x - m.x, n.y - m.y); if (d < minD) { minD = d; minJ = j; } } });
      if (minJ >= 0) { n.neighbors.push(minJ); G.nodes[minJ].neighbors.push(i); }
    }
  });
}

function seedNode(id) {
  const node = G.nodes[id]; if (!node || node.infected) return;
  node.infected = true;
  node.pulseTime = Date.now();
  const s = LANG[currentLang];
  log(`🦠 ${s.seeded.replace('{id}', String.fromCharCode(65 + id))}`, 'tx');
  playSound('click');
  if (!G.running) startGossip();
  updateStats();
}

function startGossip() {
  G.running = true;
  G.interval = setInterval(gossipRound, 1200);
}

function gossipRound() {
  const infected = G.nodes.filter(n => n.infected);
  if (infected.length === G.nodes.length) {
    clearInterval(G.interval); G.interval = null; G.running = false;
    log(`✅ ${LANG[currentLang].converged}`, 'success');
    showToast(LANG[currentLang].converged, 2500);
    updateStats();
    return;
  }

  G.round++;
  const s = LANG[currentLang];
  log(`📢 ${s.roundN.replace('{n}', G.round)}`, 'info');

  infected.forEach(node => {
    if (node.neighbors.length === 0) return;
    const targetId = node.neighbors[Math.floor(Math.random() * node.neighbors.length)];
    const target = G.nodes[targetId];
    const fromLetter = String.fromCharCode(65 + node.id);
    const toLetter = String.fromCharCode(65 + targetId);

    if (target.infected) {
      G.anims.push({ fromId: node.id, toId: targetId, start: Date.now(), success: false });
    } else if (Math.random() < G.spreadProb) {
      target.infected = true;
      target.pulseTime = Date.now();
      G.anims.push({ fromId: node.id, toId: targetId, start: Date.now(), success: true });
      log(`  ${fromLetter} ${s.spread} ${toLetter} — ${s.infected}`, 'rx');
    } else {
      G.anims.push({ fromId: node.id, toId: targetId, start: Date.now(), success: false });
    }
  });

  updateStats();
}

function updateStats() {
  const infected = G.nodes.filter(n => n.infected).length;
  const total = G.nodes.length;
  const s = LANG[currentLang];
  const sr = $('statRound'), si = $('statInfected'), st = $('statTotal'), sc = $('statConverged');
  if (sr) sr.textContent = G.round;
  if (si) si.textContent = infected;
  if (st) st.textContent = total;
  if (sc) sc.textContent = infected === total ? (s.yes || 'Yes') : (s.no || 'No');
  const fill = $('timelineFill');
  if (fill) fill.style.width = (total > 0 ? (infected / total) * 100 : 0) + '%';
}

function gossipRender() {
  function frame() { gossipDraw(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}

function gossipDraw() {
  const ctx = G.ctx; if (!ctx || !G.canvas) return;
  const w = G.canvas.width, h = G.canvas.height;
  ctx.clearRect(0, 0, w, h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a7e6e';
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Links
  const drawn = new Set();
  G.nodes.forEach(n => {
    n.neighbors.forEach(nId => {
      const key = Math.min(n.id, nId) + '-' + Math.max(n.id, nId);
      if (drawn.has(key)) return; drawn.add(key);
      const m = G.nodes[nId];
      ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = mutedCol + '25'; ctx.lineWidth = 1; ctx.stroke();
    });
  });

  // Animations
  const now = Date.now();
  G.anims = G.anims.filter(a => {
    const elapsed = (now - a.start) / 800;
    if (elapsed > 1) return false;
    const from = G.nodes[a.fromId], to = G.nodes[a.toId];
    if (!from || !to) return false;
    const px = from.x + (to.x - from.x) * elapsed;
    const py = from.y + (to.y - from.y) * elapsed;
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = a.success ? '#22c55e' : '#8a7e6e80';
    ctx.fill();
    return true;
  });

  // Nodes
  G.nodes.forEach(node => {
    // Infection pulse
    if (node.infected && now - node.pulseTime < 600) {
      const pulseProgress = (now - node.pulseTime) / 600;
      ctx.beginPath(); ctx.arc(node.x, node.y, 12 + pulseProgress * 12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,197,94,${0.3 * (1 - pulseProgress)})`; ctx.fill();
    }

    ctx.beginPath(); ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
    if (node.infected) {
      ctx.fillStyle = '#22c55e40'; ctx.fill();
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.stroke();
    } else {
      ctx.fillStyle = mutedCol + '20'; ctx.fill();
      ctx.strokeStyle = mutedCol + '60'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    ctx.font = 'bold 9px Tajawal, sans-serif'; ctx.fillStyle = textCol;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String.fromCharCode(65 + node.id), node.x, node.y);
  });
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  initLogResize();
  const sndT=$('soundToggle');
  if(sndT){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}sndT.checked=soundEnabled;sndT.addEventListener('change',()=>{soundEnabled=sndT.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  const brBtn=$('breathingBtn'),dkD=$('dhikrDisplay'),dkB=$('dhikrBtn');
  if(brBtn)brBtn.onclick=()=>{toggleBreathing();if(dkD)dkD.style.display=breathingActive?'flex':'none';};
  if(dkB)dkB.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initKonami();initHijriDate();
  gossipInit();setStatus(true);
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
