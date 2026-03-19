/**
 * Replay Attack Forge — Workshop DIY v1.0
 * Simulate capture and replay of authentication tokens
 */
const $=id=>document.getElementById(id);
const LANG={
  en:{title:'Replay Attack Forge',subtitle:'Capture and replay authentication tokens',mainSection:'Replay Attack Lab',mainDesc:'Intercept and replay captured auth tokens',authenticate:'Authenticate (legit)',capture:'Capture Token',replay:'Replay Attack',useNonce:'Enable nonce protection',results:'Results',vizTitle:'Network Traffic',vizHint:'Watch packets flow between client, attacker, and server',sectionA:'Attack Reference',sectionB:'Defense Strategies',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',authSuccess:'Authentication successful',captured:'Token captured by attacker!',replaySuccess:'Replay attack SUCCESS - unauthorized access!',replayBlocked:'Replay BLOCKED - nonce already used!',noToken:'No token captured yet',
    faq_q1:'What is a replay attack?',faq_a1:'An attacker intercepts a valid authentication message and retransmits it to gain unauthorized access.',faq_q2:'How to prevent it?',faq_a2:'Use nonces (numbers used once), timestamps, or session tokens that expire after single use.',faq_q3:'Real-world examples?',faq_a3:'Kerberos ticket replay, OAuth token theft, NFC payment replay, WiFi handshake capture.',
    howto_1:'Click Authenticate to perform a legitimate login.',howto_2:'Click Capture to intercept the authentication token.',howto_3:'Click Replay to attempt unauthorized access.',howto_4:'Toggle nonce protection to see the defense.',
    wiki_replay:'Replay attack: re-sending a valid captured packet to impersonate the original sender.',wiki_nonce:'Nonce: a random value included in each message, making each request unique and non-replayable.',wiki_timestamp:'Timestamp-based defense: reject messages with timestamps outside an acceptable window.',
    mathExplain:'Defense Strategies:\n\n1. Nonce (Number Used Once)\n   Server generates random nonce per session\n   Client includes nonce in signed request\n   Server rejects duplicate nonces\n\n2. Timestamps\n   Request includes current timestamp\n   Server rejects if |now - timestamp| > threshold\n\n3. Sequence Numbers\n   Monotonically increasing counter\n   Server rejects if seq <= last_seen\n\n4. Challenge-Response\n   Server sends random challenge\n   Client responds with HMAC(secret, challenge)'},
  fr:{title:'Forge Attaque Rejeu',subtitle:'Capturez et rejouez des jetons d\'authentification',mainSection:'Labo Attaque Rejeu',mainDesc:'Interceptez et rejouez des jetons captures',authenticate:'Authentifier',capture:'Capturer Jeton',replay:'Attaque Rejeu',useNonce:'Activer protection nonce',results:'Resultats',vizTitle:'Trafic Reseau',vizHint:'Regardez les paquets circuler',sectionA:'Reference',sectionB:'Strategies Defense',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',authSuccess:'Authentification reussie',captured:'Jeton capture par l\'attaquant!',replaySuccess:'Rejeu REUSSI - acces non autorise!',replayBlocked:'Rejeu BLOQUE - nonce deja utilise!',noToken:'Aucun jeton capture',
    faq_q1:'Attaque par rejeu?',faq_a1:'Retransmission d\'un message d\'authentification valide capture.',faq_q2:'Comment prevenir?',faq_a2:'Nonces, horodatages, ou jetons a usage unique.',faq_q3:'Exemples reels?',faq_a3:'Kerberos, OAuth, paiement NFC, WiFi.',howto_1:'Cliquez Authentifier.',howto_2:'Cliquez Capturer.',howto_3:'Cliquez Rejeu.',howto_4:'Activez le nonce.',
    wiki_replay:'Rejeu: renvoyer un paquet valide capture.',wiki_nonce:'Nonce: valeur aleatoire unique par message.',wiki_timestamp:'Defense par horodatage: rejeter les messages hors fenetre.',mathExplain:'Strategies de defense:\n1. Nonce\n2. Horodatage\n3. Numeros de sequence\n4. Challenge-Reponse'},
  ar:{title:'تزوير هجوم الإعادة',subtitle:'التقط وأعد تشغيل رموز المصادقة',mainSection:'مختبر هجوم الإعادة',mainDesc:'اعترض وأعد تشغيل الرموز الملتقطة',authenticate:'مصادقة',capture:'التقاط الرمز',replay:'هجوم الإعادة',useNonce:'تفعيل حماية nonce',results:'النتائج',vizTitle:'حركة الشبكة',vizHint:'شاهد الحزم تتدفق بين العميل والمهاجم والخادم',sectionA:'مرجع',sectionB:'استراتيجيات الدفاع',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',authSuccess:'نجحت المصادقة',captured:'تم التقاط الرمز!',replaySuccess:'نجح هجوم الإعادة - وصول غير مصرح!',replayBlocked:'تم حظر الإعادة - nonce مستخدم!',noToken:'لم يتم التقاط رمز بعد',
    faq_q1:'ما هو هجوم الإعادة؟',faq_a1:'يعترض المهاجم رسالة مصادقة صالحة ويعيد إرسالها.',faq_q2:'كيف نمنعه؟',faq_a2:'استخدام nonces أو طوابع زمنية أو رموز تنتهي بعد استخدام واحد.',faq_q3:'أمثلة حقيقية؟',faq_a3:'Kerberos, OAuth, NFC, WiFi.',howto_1:'اضغط مصادقة.',howto_2:'اضغط التقاط.',howto_3:'اضغط هجوم الإعادة.',howto_4:'فعّل حماية nonce.',
    wiki_replay:'هجوم الإعادة: إعادة إرسال حزمة صالحة ملتقطة.',wiki_nonce:'Nonce: قيمة عشوائية فريدة لكل رسالة.',wiki_timestamp:'الدفاع بالطابع الزمني: رفض الرسائل خارج النافذة المقبولة.',mathExplain:'استراتيجيات الدفاع:\n1. Nonce\n2. طابع زمني\n3. أرقام تسلسلية\n4. تحدي-استجابة'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;if($('langSelect'))$('langSelect').value=lang;try{localStorage.setItem('cry-rep-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-rep-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ REPLAY ATTACK SIMULATION ═══════ */
let capturedToken=null,usedNonces=new Set(),packets=[],animFrame;
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function randHex(n){let s='';for(let i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s}

function authenticate(){
  const nonce=randHex(8);const token=`user=alice&nonce=${nonce}&sig=${randHex(16)}`;
  usedNonces.add(nonce);const s=LANG[currentLang];
  packets.push({from:'client',to:'server',token,type:'auth',time:Date.now()});
  packets.push({from:'server',to:'client',token:'ACCESS_GRANTED',type:'response',time:Date.now()+500});
  log(s.authSuccess,'success');
  $('resultsBox').textContent=`Legitimate Authentication:\nToken: ${token}\nNonce: ${nonce}\nResult: ACCESS GRANTED`;
  drawCanvas()
}

function captureToken(){
  if(packets.length===0){authenticate()}
  const authPacket=packets.find(p=>p.type==='auth');
  if(authPacket){capturedToken=authPacket.token;const s=LANG[currentLang];
    packets.push({from:'attacker',to:'attacker',token:capturedToken,type:'capture',time:Date.now()});
    log(s.captured,'error');$('resultsBox').textContent+=`\n\nATTACKER CAPTURED:\n${capturedToken}`;drawCanvas()}
}

function replayAttack(){
  const s=LANG[currentLang];
  if(!capturedToken){log(s.noToken,'error');return}
  const nonceProtected=$('nonceToggle').checked;
  packets.push({from:'attacker',to:'server',token:capturedToken,type:'replay',time:Date.now()});
  if(nonceProtected){
    const nonceMatch=capturedToken.match(/nonce=([a-f0-9]+)/);
    if(nonceMatch&&usedNonces.has(nonceMatch[1])){
      packets.push({from:'server',to:'attacker',token:'REPLAY_BLOCKED',type:'blocked',time:Date.now()+500});
      log(s.replayBlocked,'success');$('resultsBox').textContent+=`\n\nReplay Attack: BLOCKED\nNonce ${nonceMatch[1]} already used!`;
    }
  }else{
    packets.push({from:'server',to:'attacker',token:'ACCESS_GRANTED',type:'response',time:Date.now()+500});
    log(s.replaySuccess,'error');$('resultsBox').textContent+=`\n\nReplay Attack: SUCCESS!\nAttacker gained unauthorized access!`;
  }
  drawCanvas()
}

function drawCanvas(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  // Draw entities
  const entities=[{name:'Client',x:w*.15,y:60,color:'#4ade80'},{name:'Attacker',x:w*.5,y:60,color:'#f87171'},{name:'Server',x:w*.85,y:60,color:'#60a5fa'}];
  entities.forEach(e=>{ctx.fillStyle=e.color+'44';ctx.fillRect(e.x-35,e.y-15,70,30);ctx.strokeStyle=e.color;ctx.strokeRect(e.x-35,e.y-15,70,30);ctx.fillStyle=e.color;ctx.font='bold 11px Tajawal';ctx.textAlign='center';ctx.fillText(e.name,e.x,e.y+5)});
  ctx.textAlign='left';
  // Draw vertical lines
  entities.forEach(e=>{ctx.strokeStyle=`${e.color}33`;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(e.x,e.y+20);ctx.lineTo(e.x,h-20);ctx.stroke();ctx.setLineDash([])});
  // Draw packets
  const startY=100,packetH=35;
  packets.slice(-7).forEach((p,i)=>{
    const y=startY+i*packetH;const fromE=entities.find(e=>e.name.toLowerCase()===p.from);const toE=entities.find(e=>e.name.toLowerCase()===p.to);
    if(!fromE||!toE)return;
    const color=p.type==='replay'?'#f87171':p.type==='blocked'?'#fbbf24':p.type==='capture'?'#f87171':accent;
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fromE.x,y);ctx.lineTo(toE.x,y);ctx.stroke();
    // Arrow
    const dx=toE.x-fromE.x;const dir=dx>0?1:-1;
    ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(toE.x,y);ctx.lineTo(toE.x-dir*8,y-4);ctx.lineTo(toE.x-dir*8,y+4);ctx.fill();
    // Label
    ctx.fillStyle=color;ctx.font='9px monospace';const label=p.type==='replay'?'REPLAY':p.type==='blocked'?'BLOCKED':p.type==='capture'?'CAPTURED':p.token.slice(0,25)+'...';
    ctx.fillText(label,Math.min(fromE.x,toE.x)+10,y-6)
  });
  ctx.lineWidth=1
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Replay Attack',p:s.wiki_replay},{t:'Nonce',p:s.wiki_nonce},{t:'Timestamp Defense',p:s.wiki_timestamp}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'Replay',p:LANG[currentLang].wiki_replay},{t:'Nonce',p:LANG[currentLang].wiki_nonce},{t:'Timestamp',p:LANG[currentLang].wiki_timestamp}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-rep-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-rep-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('authBtn').onclick=authenticate;$('captureBtn').onclick=captureToken;$('replayBtn').onclick=replayAttack;
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()
});

/* ═══════ ENHANCED REPLAY ATTACK VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0,_particles=[];

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();
function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === Network Topology (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Network Authentication Flow',10,16);

  const nodes=[
    {name:'Client',x:w*0.12,y:65,icon:'C',color:'#4ade80'},
    {name:'Router',x:w*0.35,y:45,icon:'R',color:'#60a5fa'},
    {name:'Attacker',x:w*0.35,y:90,icon:'A',color:'#f87171'},
    {name:'Server',x:w*0.58,y:65,icon:'S',color:'#c084fc'},
    {name:'Auth DB',x:w*0.78,y:65,icon:'DB',color:'#fbbf24'}
  ];

  // Draw connections
  const conns=[[0,1],[1,3],[3,4],[1,2]];
  conns.forEach(([a,b])=>{
    _x.strokeStyle=mut+'44';_x.lineWidth=1;
    _x.beginPath();_x.moveTo(nodes[a].x,nodes[a].y);_x.lineTo(nodes[b].x,nodes[b].y);_x.stroke();
  });

  // Animated packet along connections
  const packetConn=_t%120<30?0:_t%120<60?1:_t%120<90?2:3;
  const progress=(_t%30)/30;
  if(packetConn<conns.length){
    const[a,b]=conns[packetConn];
    const px=nodes[a].x+(nodes[b].x-nodes[a].x)*progress;
    const py=nodes[a].y+(nodes[b].y-nodes[a].y)*progress;
    _x.fillStyle=packetConn===3?'#f87171':'#4ade80';
    _x.beginPath();_x.arc(px,py,5,0,Math.PI*2);_x.fill();
    _x.fillStyle='#fff';_x.font='bold 6px SF Mono';_x.textAlign='center';
    _x.fillText('PKT',px,py+2);_x.textAlign='left';
  }

  // Draw nodes
  nodes.forEach(n=>{
    _x.fillStyle=n.color+'33';_x.beginPath();_x.arc(n.x,n.y,20,0,Math.PI*2);_x.fill();
    _x.strokeStyle=n.color;_x.lineWidth=2;_x.beginPath();_x.arc(n.x,n.y,20,0,Math.PI*2);_x.stroke();
    _x.fillStyle=n.color;_x.font='bold 10px SF Mono';_x.textAlign='center';
    _x.fillText(n.icon,n.x,n.y+4);
    _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText(n.name,n.x,n.y+30);
    _x.textAlign='left';_x.lineWidth=1;
  });

  // === Token Structure (middle-left) ===
  const tkY=120,tkW=w*0.48;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Authentication Token Structure',10,tkY);

  const fields=[
    {name:'user',val:'alice',color:'#4ade80',w:0.2},
    {name:'nonce',val:randHex(8),color:'#60a5fa',w:0.25},
    {name:'timestamp',val:Date.now().toString(36).slice(-6),color:'#fbbf24',w:0.25},
    {name:'HMAC-sig',val:randHex(8),color:'#c084fc',w:0.3}
  ];
  let fx=10;
  fields.forEach(f=>{
    const fw=f.w*tkW;
    _x.fillStyle=f.color+'22';_x.fillRect(fx,tkY+8,fw-3,35);
    _x.strokeStyle=f.color+'66';_x.strokeRect(fx,tkY+8,fw-3,35);
    _x.fillStyle=f.color;_x.font='bold 8px SF Mono';_x.fillText(f.name,fx+3,tkY+20);
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(f.val,fx+3,tkY+35);
    fx+=fw;
  });

  // === Nonce Defense Timeline (middle-right) ===
  const ndX=w*0.52,ndY=tkY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Nonce Lifecycle & Expiration',ndX,ndY);

  const nNonces=8;
  const nW=(w*0.46)/nNonces;
  for(let i=0;i<nNonces;i++){
    const x=ndX+i*nW;
    const age=(_t+i*20)%100;
    const isExpired=age>70;
    const isActive=age<30;
    _x.fillStyle=isExpired?'#f8717133':isActive?'#4ade8044':'#fbbf2433';
    _x.fillRect(x,ndY+8,nW-3,35);
    _x.fillStyle=isExpired?'#f87171':isActive?'#4ade80':'#fbbf24';
    _x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(`N${i}`,x+nW/2,ndY+20);
    _x.fillText(isExpired?'EXPIRED':isActive?'ACTIVE':'AGING',x+nW/2,ndY+36);
    // TTL bar
    const ttl=Math.max(0,1-age/100);
    _x.fillStyle=`rgba(${isExpired?248:74},${isExpired?113:222},${isExpired?113:128},.3)`;
    _x.fillRect(x+2,ndY+38,ttl*(nW-7),4);
    _x.textAlign='left';
  }

  // === Replay Detection Matrix (bottom-left) ===
  const rdY=tkY+55,rdW=w*0.48,rdH=h-rdY-65;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Challenge-Response Protocol',10,rdY);

  const steps=[
    {label:'1. Client -> Server: Hello',color:'#4ade80'},
    {label:'2. Server -> Client: Challenge (random)',color:'#c084fc'},
    {label:'3. Client -> Server: HMAC(key, challenge)',color:'#4ade80'},
    {label:'4. Server verifies HMAC',color:'#c084fc'},
    {label:'5. Attacker replays step 3...',color:'#f87171'},
    {label:'6. Server rejects: stale challenge!',color:'#f87171'}
  ];
  steps.forEach((s,i)=>{
    const y=rdY+12+i*18;
    const active=Math.floor(_t/40)%steps.length===i;
    _x.fillStyle=active?s.color+'44':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,rdW-5,16);
    _x.fillStyle=active?s.color:mut;
    _x.font='9px SF Mono';_x.fillText(s.label,14,y+12);
    if(active){
      _x.fillStyle=s.color;_x.beginPath();_x.arc(rdW+2,y+8,3,0,Math.PI*2);_x.fill();
    }
  });

  // === Timestamp Window (bottom-right) ===
  const twX=w*0.52,twY=rdY,twW=w*0.46,twH=h-rdY-65;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Timestamp Acceptance Window',twX,twY);

  const windowSize=60;
  const timeline=twW-10;
  const now=_t%200;
  // Timeline
  _x.fillStyle='rgba(255,255,255,.03)';_x.fillRect(twX,twY+15,timeline,25);
  // Acceptance window
  const winStart=Math.max(0,(now-windowSize/2)/200)*timeline;
  const winEnd=Math.min(200,(now+windowSize/2))/200*timeline;
  _x.fillStyle='#4ade8022';_x.fillRect(twX+winStart,twY+15,winEnd-winStart,25);
  _x.strokeStyle='#4ade80';_x.strokeRect(twX+winStart,twY+15,winEnd-winStart,25);
  // Now marker
  const nowX=twX+(now/200)*timeline;
  _x.fillStyle='#fbbf24';_x.beginPath();_x.moveTo(nowX,twY+12);_x.lineTo(nowX-4,twY+8);_x.lineTo(nowX+4,twY+8);_x.fill();
  _x.fillStyle='#fbbf24';_x.font='7px SF Mono';_x.fillText('NOW',nowX-8,twY+7);

  // Incoming requests (some in window, some out)
  for(let i=0;i<12;i++){
    const reqTime=(i*17+_t*0.5)%200;
    const rx=twX+(reqTime/200)*timeline;
    const inWindow=Math.abs(reqTime-now)<windowSize/2;
    _x.fillStyle=inWindow?'#4ade80':'#f87171';
    _x.beginPath();_x.arc(rx,twY+28,3,0,Math.PI*2);_x.fill();
  }

  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('Green = accepted, Red = rejected (outside window)',twX,twY+50);

  // === Sequence Number Counter (bottom) ===
  const seqY=h-55;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Sequence Number Defense',10,seqY);
  const seqCount=16;
  const seqW=(w-20)/seqCount;
  for(let i=0;i<seqCount;i++){
    const val=(_t+i*7)%256;
    const isMonotonic=i===0||val>((_t+(i-1)*7)%256);
    _x.fillStyle=isMonotonic?'#4ade8022':'#f8717122';
    _x.fillRect(10+i*seqW,seqY+8,seqW-2,22);
    _x.fillStyle=isMonotonic?'#4ade80':'#f87171';_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText(`${val}`,10+i*seqW+seqW/2,seqY+22);
    _x.textAlign='left';
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('Monotonically increasing sequence prevents replay',10,seqY+38);

  requestAnimationFrame(draw);
}
draw();
})();
