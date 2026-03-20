/**
 * RF IoT Audit — Workshop DIY v1.2
 * WiFi+BLE+ESP-NOW simultaneous protocol audit
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.06;const n=audioCtx.currentTime;o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}

const LANG = {
  en:{title:'🔍 RF IoT Audit',subtitle:'WiFi+BLE+ESP-NOW Simultaneously',disconnected:'Idle',connected:'Auditing',mainSection:'3-Protocol Concurrent Monitor',mainDesc:'Audit WiFi, BLE, and ESP-NOW simultaneously',sectionA:'Protocol Distribution',sectionB:'Audit Report',sectionC:'Multi-Protocol Theory',startAudit:'Start Audit',stop:'Stop',theory1:'ESP32 can monitor WiFi, BLE, and ESP-NOW simultaneously using its dual-radio architecture and time-division multiplexing.',theory2:'WiFi scanning captures probe requests, beacons, and data frames. BLE scanning finds advertising devices. ESP-NOW listens for peer-to-peer messages.',theory3:'IoT auditing reveals all wireless devices in range, their protocols, signal strength, and communication patterns.',theory4:'Security audit flags include unencrypted ESP-NOW, open WiFi networks, and BLE devices broadcasting sensitive data.',splashHint:'tap to skip',ready:'🔍 RF IoT Audit ready!',langChanged:'Language → English',auditStarted:'Audit started — scanning 3 protocols',auditStopped:'Audit stopped',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need ESP32. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Esp Ble Xray and Esp Rf Bridge! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr:{title:'🔍 Audit RF IoT',subtitle:'WiFi+BLE+ESP-NOW Simultane',disconnected:'Inactif',connected:'Audit en cours',mainSection:'Moniteur 3 protocoles',mainDesc:'Auditez WiFi, BLE et ESP-NOW simultanement',sectionA:'Distribution des protocoles',sectionB:'Rapport d\'audit',sectionC:'Theorie multi-protocole',startAudit:'Demarrer audit',stop:'Arreter',theory1:'L\'ESP32 peut surveiller WiFi, BLE et ESP-NOW simultanement grace a son architecture double radio.',theory2:'Le scan WiFi capture les probes, beacons et trames de donnees. Le BLE trouve les appareils en publicite.',theory3:'L\'audit IoT revele tous les appareils sans fil a portee.',theory4:'Les alertes de securite incluent ESP-NOW non chiffre et reseaux WiFi ouverts.',splashHint:'appuyer pour passer',ready:'🔍 Audit RF IoT pret!',langChanged:'Langue → Francais',auditStarted:'Audit demarre',auditStopped:'Audit arrete',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut ESP32. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Ble Xray and Esp Rf Bridge ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar:{title:'🔍 تدقيق RF IoT',subtitle:'WiFi+BLE+ESP-NOW في وقت واحد',disconnected:'خامل',connected:'جارٍ التدقيق',mainSection:'مراقب 3 بروتوكولات',mainDesc:'تدقيق WiFi وBLE وESP-NOW في وقت واحد',sectionA:'توزيع البروتوكولات',sectionB:'تقرير التدقيق',sectionC:'نظرية متعددة البروتوكولات',startAudit:'بدء التدقيق',stop:'إيقاف',theory1:'يمكن لـ ESP32 مراقبة WiFi وBLE وESP-NOW في وقت واحد باستخدام بنية الراديو المزدوجة.',theory2:'يلتقط مسح WiFi طلبات الاستكشاف والإشارات. يجد مسح BLE الأجهزة المعلنة.',theory3:'يكشف تدقيق IoT عن جميع الأجهزة اللاسلكية في النطاق.',theory4:'تشمل تنبيهات الأمان ESP-NOW غير المشفر وشبكات WiFi المفتوحة.',splashHint:'انقر للتخطي',ready:'🔍 تدقيق RF IoT جاهز!',langChanged:'اللغة ← العربية',auditStarted:'بدأ التدقيق',auditStopped:'توقف التدقيق',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج ESP32. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Ble Xray and Esp Rf Bridge! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};

function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);
function setLanguage(lang){currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});localStorage.setItem('iotaudit-lang',lang);log(LANG[lang]?.langChanged||'Lang','info')}
function setTheme(name){document.documentElement.setAttribute('data-theme',name);if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');else document.documentElement.classList.remove('light-theme');localStorage.setItem('iotaudit-theme',name)}
function log(msg,type='info'){const c=$('logContainer');if(!c)return;const line=document.createElement('div');line.className='log-line log-'+type;line.innerHTML=`<span class="log-ts">${new Date().toLocaleTimeString()}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;c.appendChild(line);c.scrollTop=c.scrollHeight}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(()=>t?.classList.remove('show'),ms)}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ SIMULATED DEVICES ═══════ */
const WIFI_DEVICES = [
  {ssid:'HomeNet-5G',bssid:'AA:BB:CC:11:22:33',ch:6,rssi:-42,enc:'WPA2'},
  {ssid:'Office-WiFi',bssid:'DD:EE:FF:44:55:66',ch:1,rssi:-55,enc:'WPA3'},
  {ssid:'Guest',bssid:'11:22:33:44:55:66',ch:11,rssi:-68,enc:'Open'},
  {ssid:'IoT-Network',bssid:'77:88:99:AA:BB:CC',ch:6,rssi:-60,enc:'WPA2'},
  {ssid:'',bssid:'DE:AD:BE:EF:00:01',ch:3,rssi:-75,enc:'Hidden'},
];
const BLE_DEVICES = [
  {name:'iPhone-12',mac:'A1:B2:C3:D4:E5:01',rssi:-40,type:'Phone'},
  {name:'Mi Band 7',mac:'A1:B2:C3:D4:E5:02',rssi:-58,type:'Fitness'},
  {name:'AirTag',mac:'A1:B2:C3:D4:E5:03',rssi:-72,type:'Tracker'},
  {name:'Smart Plug',mac:'A1:B2:C3:D4:E5:04',rssi:-65,type:'IoT'},
  {name:'BLE Beacon',mac:'A1:B2:C3:D4:E5:05',rssi:-80,type:'Beacon'},
  {name:'Smart Lock',mac:'A1:B2:C3:D4:E5:06',rssi:-48,type:'Security'},
];
const ESPNOW_PEERS = [
  {mac:'E0:E0:E0:01:01:01',rssi:-35,payload:'Sensor: Temp=23.5C'},
  {mac:'E0:E0:E0:02:02:02',rssi:-52,payload:'Sensor: Hum=65%'},
  {mac:'E0:E0:E0:03:03:03',rssi:-44,payload:'Relay: ON'},
  {mac:'E0:E0:E0:04:04:04',rssi:-70,payload:'Alert: Motion'},
];

let auditing = false, auditTimer = null;
let wifiPkts=0, blePkts=0, espnowPkts=0;
let distHistory = [];

function renderWifi(){
  const el=$('wifiDevices');if(!el)return;
  const subset = WIFI_DEVICES.slice(0, 2+Math.floor(Math.random()*3));
  el.innerHTML = subset.map(d=>{
    const rssi=d.rssi+Math.floor(Math.random()*8-4);
    const flag = d.enc==='Open'?'<span style="color:#f44">OPEN</span>':d.enc;
    return `<div class="device-row"><span style="color:#3ba5f7">${d.ssid||'[Hidden]'}</span><span>${flag}</span><span>${rssi}dBm</span></div>`;
  }).join('');
  wifiPkts += 1+Math.floor(Math.random()*5);
  $('wifiCount').textContent = wifiPkts;
}

function renderBle(){
  const el=$('bleDevices');if(!el)return;
  const subset = BLE_DEVICES.slice(0, 2+Math.floor(Math.random()*4));
  el.innerHTML = subset.map(d=>{
    const rssi=d.rssi+Math.floor(Math.random()*6-3);
    return `<div class="device-row"><span style="color:#0af">${d.name}</span><span>${d.type}</span><span>${rssi}dBm</span></div>`;
  }).join('');
  blePkts += 1+Math.floor(Math.random()*3);
  $('bleCount').textContent = blePkts;
}

function renderEspnow(){
  const el=$('espnowDevices');if(!el)return;
  const subset = ESPNOW_PEERS.slice(0, 1+Math.floor(Math.random()*3));
  el.innerHTML = subset.map(d=>{
    const rssi=d.rssi+Math.floor(Math.random()*6-3);
    return `<div class="device-row"><span style="color:#f90">${d.mac.slice(-8)}</span><span>${d.payload}</span><span>${rssi}dBm</span></div>`;
  }).join('');
  espnowPkts += Math.random()<.6?1:0;
  $('espnowCount').textContent = espnowPkts;
}

function drawDistribution(){
  const canvas=$('distCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  distHistory.push({w:wifiPkts,b:blePkts,e:espnowPkts});
  if(distHistory.length>150)distHistory.shift();
  const max=Math.max(10,...distHistory.map(d=>Math.max(d.w,d.b,d.e)));
  const draw=(key,color)=>{ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();distHistory.forEach((d,i)=>{const x=i/(distHistory.length-1)*W,y=H-10-(d[key]/max)*(H-20);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.stroke()};
  draw('w','#3ba5f7');draw('b','#0af');draw('e','#f90');
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='10px monospace';
  ctx.fillText('WiFi',5,14);ctx.fillStyle='#3ba5f7';ctx.fillRect(40,6,20,8);
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillText('BLE',70,14);ctx.fillStyle='#0af';ctx.fillRect(100,6,20,8);
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillText('ESP-NOW',130,14);ctx.fillStyle='#f90';ctx.fillRect(195,6,20,8);
}

function updateReport(){
  const el=$('auditReport');if(!el)return;
  const total=wifiPkts+blePkts+espnowPkts;
  const openNets=WIFI_DEVICES.filter(d=>d.enc==='Open').length;
  const flags=[];
  if(openNets>0) flags.push(`WARNING: ${openNets} open WiFi network(s) detected`);
  if(espnowPkts>0) flags.push('NOTE: ESP-NOW traffic detected (check encryption)');
  if(BLE_DEVICES.some(d=>d.type==='Tracker')) flags.push('INFO: BLE tracker device(s) in range');
  el.innerHTML = `<div>Total packets: <strong>${total}</strong></div><div>WiFi: <strong>${wifiPkts}</strong> | BLE: <strong>${blePkts}</strong> | ESP-NOW: <strong>${espnowPkts}</strong></div><div>Unique WiFi APs: <strong>${WIFI_DEVICES.length}</strong></div><div>Unique BLE devices: <strong>${BLE_DEVICES.length}</strong></div><div>ESP-NOW peers: <strong>${ESPNOW_PEERS.length}</strong></div><hr style="border-color:rgba(255,255,255,.1);margin:8px 0"><div style="color:${flags.length?'#f90':'#0f0'}">${flags.length?flags.join('<br>'):'No security issues detected'}</div>`;
}

function auditTick(){
  renderWifi();renderBle();renderEspnow();drawDistribution();updateReport();
}

function startAudit(){
  if(auditing)return;auditing=true;wifiPkts=0;blePkts=0;espnowPkts=0;distHistory=[];
  setStatus(true);playSound('click');
  log(LANG[currentLang]?.auditStarted||'Audit started','success');
  auditTick();
  auditTimer=setInterval(auditTick,1000);
}
function stopAudit(){
  auditing=false;if(auditTimer)clearInterval(auditTimer);
  setStatus(false);log(LANG[currentLang]?.auditStopped||'Audit stopped','info');
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang=localStorage.getItem('iotaudit-lang')||'en';
  const savedTheme=localStorage.getItem('iotaudit-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',()=>openPanel('helpPanel','helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('helpOverlay')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('settingsBtn')?.addEventListener('click',()=>openPanel('settingsPanel','settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('logBtn')?.addEventListener('click',()=>$('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click',()=>$('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked});
  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log('Log cleared','info')});
  $('copyLogBtn')?.addEventListener('click',()=>{navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast('Copied!',1500))});

  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'}[tab.dataset.tab])?.classList.add('active')})});
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none'})})});

  $('auditBtn')?.addEventListener('click',startAudit);
  $('stopBtn')?.addEventListener('click',stopAudit);

  setStatus(false);log(LANG[currentLang]?.ready||'Ready','success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — RF IoT Audit: 3-protocol concurrent
   monitor with WiFi/BLE/ESP-NOW device radar and audit findings
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simIotAuditCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const auditDevs=[],scanPulses=[],findings=[];
  const PROTO_DEFS=[
    {name:'WiFi',color:'#4d96ff',icon:'\u{1F4F6}',ring:60},
    {name:'BLE',color:'#ff78ae',icon:'\u{1F499}',ring:100},
    {name:'ESP-NOW',color:'#ffd93d',icon:'\u26A1',ring:140}
  ];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  class AuditDev{
    constructor(){
      this.proto=PROTO_DEFS[Math.floor(Math.random()*PROTO_DEFS.length)];
      const angle=Math.random()*Math.PI*2;
      const dist=this.proto.ring+Math.random()*30-15;
      this.x=W/2+Math.cos(angle)*dist;this.y=H/2+Math.sin(angle)*dist;
      this.rssi=-30-Math.random()*50;this.secure=Math.random()>0.3;
      this.mac=Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':');
      this.pulse=Math.random()*Math.PI*2;this.alive=200+Math.random()*300;this.age=0;
    }
    update(){this.age++;this.pulse+=0.04;return this.age<this.alive;}
    draw(){
      const alpha=Math.min(1,(this.alive-this.age)/40)*0.8;const glow=3+Math.sin(this.pulse)*2;
      ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor=this.proto.color;ctx.shadowBlur=glow;
      ctx.beginPath();ctx.arc(this.x,this.y,8,0,Math.PI*2);ctx.fillStyle=this.proto.color+'33';ctx.fill();
      ctx.strokeStyle=this.secure?this.proto.color:'#ff4444';ctx.lineWidth=this.secure?1:2;ctx.stroke();ctx.shadowBlur=0;
      ctx.font='8px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.proto.icon,this.x,this.y);
      if(!this.secure){ctx.font='bold 7px monospace';ctx.fillStyle='#ff4444';ctx.fillText('\u26A0',this.x+10,this.y-6);}
      ctx.font='6px monospace';ctx.fillStyle=this.proto.color;ctx.fillText(this.mac.slice(0,8),this.x,this.y+14);ctx.restore();
    }
  }

  class ScanPulse{
    constructor(proto){this.ring=proto.ring;this.color=proto.color;this.r=0;this.maxR=this.ring+20;this.alpha=0.4;}
    update(){this.r+=1;this.alpha=0.4*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){ctx.beginPath();ctx.arc(W/2,H/2,this.r,0,Math.PI*2);ctx.strokeStyle=this.color.replace(')',','+this.alpha+')').replace('rgb','rgba');ctx.strokeStyle=this.color+Math.floor(this.alpha*255).toString(16).padStart(2,'0');ctx.lineWidth=2;ctx.stroke();}
  }

  function drawProtoRings(){
    PROTO_DEFS.forEach(p=>{ctx.beginPath();ctx.arc(W/2,H/2,p.ring,0,Math.PI*2);ctx.strokeStyle=p.color+'22';ctx.lineWidth=1;ctx.setLineDash([4,8]);ctx.stroke();ctx.setLineDash([]);
      ctx.font='7px monospace';ctx.fillStyle=p.color+'88';ctx.textAlign='left';ctx.fillText(p.name,W/2+p.ring+4,H/2);});
  }

  function drawScanner(){
    ctx.save();ctx.shadowColor='#fff';ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(W/2,H/2,14,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F50D}',W/2,H/2);
    ctx.font='7px monospace';ctx.fillStyle='#fff';ctx.fillText('AUDITOR',W/2,H/2+22);ctx.restore();
  }

  /* Audit findings ticker at bottom */
  function drawFindings(){
    const fh=24;ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(0,H-fh,W,fh);
    const insecure=auditDevs.filter(d=>!d.secure);
    const msg=insecure.length>0?'\u26A0 '+insecure.length+' insecure device'+(insecure.length>1?'s':'')+' found — '+insecure.map(d=>d.proto.name).join(', '):'All devices secure \u2714';
    ctx.font='9px monospace';ctx.fillStyle=insecure.length>0?'#ff6666':'#6bcb77';ctx.textAlign='center';
    ctx.fillText(msg,W/2,H-8);
  }

  /* Protocol pie chart */
  function drawPieChart(){
    const counts={};PROTO_DEFS.forEach(p=>counts[p.name]=0);auditDevs.forEach(d=>counts[d.proto.name]++);
    const total=auditDevs.length||1;let startAngle=0;const cx=W-50,cy=50,r=30;
    PROTO_DEFS.forEach(p=>{const slice=counts[p.name]/total*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,startAngle,startAngle+slice);ctx.closePath();ctx.fillStyle=p.color+'66';ctx.fill();ctx.strokeStyle=p.color;ctx.lineWidth=1;ctx.stroke();startAngle+=slice;});
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.textAlign='center';ctx.fillText('Protocol Mix',cx,cy+r+10);
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,68);ctx.strokeStyle='#ffd93d33';ctx.strokeRect(8,8,185,68);
    ctx.font='10px monospace';ctx.fillStyle='#ffd93d';ctx.textAlign='left';ctx.fillText('\u{1F50D} RF IOT AUDIT',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Devices: '+auditDevs.length,16,40);
    ctx.fillText('Secure: '+auditDevs.filter(d=>d.secure).length+'  Insecure: '+auditDevs.filter(d=>!d.secure).length,16,54);
    ctx.fillText('Protocols: 3 concurrent',16,68);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,16,0.14)';ctx.fillRect(0,0,W,H);
    drawProtoRings();drawScanner();
    // Scan pulses
    if(frameCount%45===0)PROTO_DEFS.forEach(p=>scanPulses.push(new ScanPulse(p)));
    for(let i=scanPulses.length-1;i>=0;i--){if(!scanPulses[i].update())scanPulses.splice(i,1);else scanPulses[i].draw();}
    // Spawn devices
    if(frameCount%25===0&&auditDevs.length<24)auditDevs.push(new AuditDev());
    for(let i=auditDevs.length-1;i>=0;i--){if(!auditDevs[i].update())auditDevs.splice(i,1);else auditDevs[i].draw();}
    drawPieChart();drawFindings();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
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

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}
