/**
 * Hash Collision Finder — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas Sim
 */
const $=id=>document.getElementById(id);
const LANG={
  en:{title:'Hash Collision Finder',subtitle:'Find two inputs producing the same hash digest',mainSection:'Collision Search',mainDesc:'Search for hash collisions in truncated digests',bitsLabel:'Hash Bits (truncated)',bitsHint:'Fewer bits = faster collisions (birthday paradox)',startSearch:'Start Search',stop:'Stop',results:'Results',vizTitle:'Collision Visualization',vizHint:'Watch hash values accumulate until a collision is found',sectionA:'Hash Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',found:'Collision found!',searching:'Searching...',noCollision:'No collision yet',faq_q1:'What is a hash collision?',faq_a1:'When two different inputs produce the same hash output. Ideally impossible but becomes likely with truncated hashes.',faq_q2:'Why truncate the hash?',faq_a2:'Full SHA-256 has 2^256 possible outputs. Truncating to 16 bits means only 65536 possible values, making collisions feasible.',faq_q3:'What is the birthday paradox?',faq_a3:'You only need about sqrt(N) random values to find a collision among N possibilities. For 16 bits, ~256 inputs suffice.',howto_1:'Select the number of hash bits.',howto_2:'Click Start Search to begin.',howto_3:'Watch the canvas as hashes accumulate.',howto_4:'A collision appears when two dots overlap.',wiki_hash:'A hash function maps arbitrary data to a fixed-size digest. SHA-256 produces 256-bit output.',wiki_birthday:'Birthday paradox: in a group of 23 people, there is a 50% chance two share a birthday (365 possibilities).',wiki_collision:'Collision resistance: it should take O(2^(n/2)) operations to find a collision for an n-bit hash.',mathExplain:'Birthday Attack Complexity:\nFor n-bit hash: ~2^(n/2) attempts needed\n\n8 bits:  ~16 attempts\n16 bits: ~256 attempts\n24 bits: ~4096 attempts\n32 bits: ~65536 attempts\n\nP(collision after k attempts) = 1 - Product(1 - i/2^n) for i=0..k-1'},
  fr:{title:'Chercheur de Collisions',subtitle:'Trouvez deux entrees produisant le meme condensat',mainSection:'Recherche de Collision',mainDesc:'Cherchez des collisions dans des condensats tronques',bitsLabel:'Bits de Hash (tronques)',bitsHint:'Moins de bits = collisions plus rapides',startSearch:'Lancer Recherche',stop:'Arreter',results:'Resultats',vizTitle:'Visualisation des Collisions',vizHint:'Regardez les hachages s\'accumuler',sectionA:'Reference Hash',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',found:'Collision trouvee!',searching:'Recherche...',noCollision:'Pas encore de collision',faq_q1:'Qu\'est-ce qu\'une collision?',faq_a1:'Quand deux entrees differentes produisent le meme condensat.',faq_q2:'Pourquoi tronquer?',faq_a2:'SHA-256 complet a 2^256 sorties possibles. Tronquer a 16 bits = 65536 valeurs.',faq_q3:'Paradoxe des anniversaires?',faq_a3:'Il faut environ sqrt(N) valeurs pour trouver une collision parmi N possibilites.',howto_1:'Choisissez le nombre de bits.',howto_2:'Cliquez Lancer.',howto_3:'Regardez le canvas.',howto_4:'Une collision apparait quand deux points se chevauchent.',wiki_hash:'Une fonction de hachage mappe des donnees a un condensat de taille fixe.',wiki_birthday:'Paradoxe des anniversaires: 23 personnes suffisent pour 50% de chance de partager un anniversaire.',wiki_collision:'Resistance aux collisions: O(2^(n/2)) operations pour n bits.',mathExplain:'Complexite attaque anniversaire:\nPour hash n bits: ~2^(n/2) essais\n\n8 bits: ~16 essais\n16 bits: ~256 essais\n24 bits: ~4096 essais'},
  ar:{title:'كاشف تصادم التجزئة',subtitle:'ابحث عن مدخلين ينتجان نفس البصمة',mainSection:'بحث التصادم',mainDesc:'ابحث عن تصادمات في بصمات مقتطعة',bitsLabel:'بتات التجزئة (مقتطعة)',bitsHint:'بتات أقل = تصادمات أسرع',startSearch:'بدء البحث',stop:'إيقاف',results:'النتائج',vizTitle:'تصور التصادم',vizHint:'شاهد قيم التجزئة تتراكم حتى يحدث تصادم',sectionA:'مرجع التجزئة',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',found:'تم إيجاد تصادم!',searching:'جاري البحث...',noCollision:'لا تصادم بعد',faq_q1:'ما هو تصادم التجزئة؟',faq_a1:'عندما ينتج مدخلان مختلفان نفس البصمة.',faq_q2:'لماذا الاقتطاع؟',faq_a2:'SHA-256 الكامل له 2^256 مخرج. الاقتطاع إلى 16 بت = 65536 قيمة.',faq_q3:'مفارقة عيد الميلاد؟',faq_a3:'تحتاج فقط sqrt(N) قيمة لإيجاد تصادم من بين N احتمال.',howto_1:'اختر عدد البتات.',howto_2:'اضغط بدء البحث.',howto_3:'شاهد اللوحة.',howto_4:'يظهر التصادم عندما تتداخل نقطتان.',wiki_hash:'دالة التجزئة تحول بيانات عشوائية إلى بصمة بحجم ثابت.',wiki_birthday:'مفارقة عيد الميلاد: 23 شخصا يكفي لاحتمال 50% لتشارك يوم ميلاد.',wiki_collision:'مقاومة التصادم: O(2^(n/2)) عملية لتجزئة n بت.',mathExplain:'تعقيد هجوم عيد الميلاد:\nلتجزئة n بت: ~2^(n/2) محاولة\n\n8 بت: ~16 محاولة\n16 بت: ~256 محاولة\n24 بت: ~4096 محاولة'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-hash-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-hash-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}else{osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ═══════ SIMPLE HASH (djb2-like, truncatable) ═══════ */
function simpleHash(str,bits){let h=5381;for(let i=0;i<str.length;i++)h=((h<<5)+h+str.charCodeAt(i))>>>0;return h&((1<<bits)-1)}

/* ═══════ CANVAS ═══════ */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
let searching=false,hashMap={},attempts=[],collisionPair=null,animFrame;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawSim(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  const bits=parseInt($('bitsSelect').value)||16,maxVal=1<<bits;
  // Title
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText(`Hash Collision Search (${bits}-bit)`,10,22);
  ctx.fillStyle=muted;ctx.font='11px Tajawal,sans-serif';ctx.fillText(`Attempts: ${attempts.length} / Expected: ~${Math.ceil(Math.sqrt(maxVal))}`,10,38);
  // Hash space grid
  const cols=Math.ceil(Math.sqrt(maxVal)),cellW=(w-20)/cols,gridY=50,gridH=h-60;
  const cellH=gridH/cols;
  // Draw occupied cells
  const occupied=new Set(attempts.map(a=>a.hash));
  occupied.forEach(hv=>{const gx=hv%cols,gy=Math.floor(hv/cols);
    ctx.fillStyle=`${accent}33`;ctx.fillRect(10+gx*cellW,gridY+gy*cellH,Math.max(cellW-.5,1),Math.max(cellH-.5,1))});
  // Draw recent attempts as dots
  const recent=attempts.slice(-200);
  recent.forEach((a,i)=>{const gx=a.hash%cols,gy=Math.floor(a.hash/cols);
    const alpha=.3+.7*(i/recent.length);ctx.fillStyle=a.collision?'#f87171':`rgba(74,222,128,${alpha})`;
    ctx.beginPath();ctx.arc(10+gx*cellW+cellW/2,gridY+gy*cellH+cellH/2,Math.max(2,cellW/3),0,Math.PI*2);ctx.fill()});
  // Collision highlight
  if(collisionPair){const gx=collisionPair.hash%cols,gy=Math.floor(collisionPair.hash/cols);
    ctx.strokeStyle='#f87171';ctx.lineWidth=3;ctx.beginPath();ctx.arc(10+gx*cellW+cellW/2,gridY+gy*cellH+cellH/2,Math.max(8,cellW),0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#f87171';ctx.font='bold 12px Tajawal';ctx.fillText('COLLISION!',10+gx*cellW+cellW+5,gridY+gy*cellH+cellH/2+4)}
  // Progress bar
  const progress=Math.min(1,attempts.length/Math.sqrt(maxVal));
  ctx.fillStyle=`${accent}22`;ctx.fillRect(10,h-12,w-20,8);
  ctx.fillStyle=accent;ctx.fillRect(10,h-12,progress*(w-20),8);
  if(searching)animFrame=requestAnimationFrame(drawSim)
}

function startSearch(){
  const bits=parseInt($('bitsSelect').value);hashMap={};attempts=[];collisionPair=null;searching=true;
  const s=LANG[currentLang];log(s.searching,'info');showToast(s.searching);$('resultsBox').textContent='';resizeCanvas();drawSim();
  let count=0;
  function step(){
    if(!searching)return;
    const batch=100;
    for(let i=0;i<batch;i++){count++;const input=`msg_${count}_${Math.random().toString(36).slice(2)}`;
      const h=simpleHash(input,bits);const entry={input,hash:h,collision:false};
      if(hashMap[h]!==undefined){entry.collision=true;collisionPair={hash:h,input1:hashMap[h],input2:input};
        attempts.push(entry);searching=false;hideToast();drawSim();
        const out=`${s.found}\n\nInput 1: "${collisionPair.input1}"\nInput 2: "${collisionPair.input2}"\nHash: 0x${h.toString(16).padStart(bits/4,'0')} (${h})\n\nAttempts: ${count}\nExpected (birthday): ~${Math.ceil(Math.sqrt(1<<bits))}`;
        $('resultsBox').textContent=out;log(`${s.found} after ${count} attempts`,'success');return}
      hashMap[h]=input;attempts.push(entry)}
    setTimeout(step,0)}
  setTimeout(step,0)}
function stopSearch(){searching=false;hideToast();if(animFrame)cancelAnimationFrame(animFrame);log('Search stopped','info')}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Hash Functions',p:s.wiki_hash},{t:'Birthday Paradox',p:s.wiki_birthday},{t:'Collision Resistance',p:s.wiki_collision}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=`<div class="wiki-entry"><h3>Hash Functions</h3><p>${LANG[currentLang].wiki_hash}</p></div><div class="wiki-entry"><h3>Birthday Paradox</h3><p>${LANG[currentLang].wiki_birthday}</p></div><div class="wiki-entry"><h3>Collision Resistance</h3><p>${LANG[currentLang].wiki_collision}</p></div>`}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',resizeCanvas);
  try{const l=localStorage.getItem('cry-hash-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-hash-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);$(id).classList.add('active')}});
  $('searchBtn').onclick=startSearch;$('stopBtn').onclick=stopSearch;
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawSim()
});
