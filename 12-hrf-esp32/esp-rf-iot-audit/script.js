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
  en:{title:'🔍 RF IoT Audit',subtitle:'WiFi+BLE+ESP-NOW Simultaneously',disconnected:'Idle',connected:'Auditing',mainSection:'3-Protocol Concurrent Monitor',mainDesc:'Audit WiFi, BLE, and ESP-NOW simultaneously',sectionA:'Protocol Distribution',sectionB:'Audit Report',sectionC:'Multi-Protocol Theory',startAudit:'Start Audit',stop:'Stop',theory1:'ESP32 can monitor WiFi, BLE, and ESP-NOW simultaneously using its dual-radio architecture and time-division multiplexing.',theory2:'WiFi scanning captures probe requests, beacons, and data frames. BLE scanning finds advertising devices. ESP-NOW listens for peer-to-peer messages.',theory3:'IoT auditing reveals all wireless devices in range, their protocols, signal strength, and communication patterns.',theory4:'Security audit flags include unencrypted ESP-NOW, open WiFi networks, and BLE devices broadcasting sensitive data.',splashHint:'tap to skip',ready:'🔍 RF IoT Audit ready!',langChanged:'Language → English',auditStarted:'Audit started — scanning 3 protocols',auditStopped:'Audit stopped',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},
  fr:{title:'🔍 Audit RF IoT',subtitle:'WiFi+BLE+ESP-NOW Simultane',disconnected:'Inactif',connected:'Audit en cours',mainSection:'Moniteur 3 protocoles',mainDesc:'Auditez WiFi, BLE et ESP-NOW simultanement',sectionA:'Distribution des protocoles',sectionB:'Rapport d\'audit',sectionC:'Theorie multi-protocole',startAudit:'Demarrer audit',stop:'Arreter',theory1:'L\'ESP32 peut surveiller WiFi, BLE et ESP-NOW simultanement grace a son architecture double radio.',theory2:'Le scan WiFi capture les probes, beacons et trames de donnees. Le BLE trouve les appareils en publicite.',theory3:'L\'audit IoT revele tous les appareils sans fil a portee.',theory4:'Les alertes de securite incluent ESP-NOW non chiffre et reseaux WiFi ouverts.',splashHint:'appuyer pour passer',ready:'🔍 Audit RF IoT pret!',langChanged:'Langue → Francais',auditStarted:'Audit demarre',auditStopped:'Audit arrete',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},
  ar:{title:'🔍 تدقيق RF IoT',subtitle:'WiFi+BLE+ESP-NOW في وقت واحد',disconnected:'خامل',connected:'جارٍ التدقيق',mainSection:'مراقب 3 بروتوكولات',mainDesc:'تدقيق WiFi وBLE وESP-NOW في وقت واحد',sectionA:'توزيع البروتوكولات',sectionB:'تقرير التدقيق',sectionC:'نظرية متعددة البروتوكولات',startAudit:'بدء التدقيق',stop:'إيقاف',theory1:'يمكن لـ ESP32 مراقبة WiFi وBLE وESP-NOW في وقت واحد باستخدام بنية الراديو المزدوجة.',theory2:'يلتقط مسح WiFi طلبات الاستكشاف والإشارات. يجد مسح BLE الأجهزة المعلنة.',theory3:'يكشف تدقيق IoT عن جميع الأجهزة اللاسلكية في النطاق.',theory4:'تشمل تنبيهات الأمان ESP-NOW غير المشفر وشبكات WiFi المفتوحة.',splashHint:'انقر للتخطي',ready:'🔍 تدقيق RF IoT جاهز!',langChanged:'اللغة ← العربية',auditStarted:'بدأ التدقيق',auditStopped:'توقف التدقيق',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.'}
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
