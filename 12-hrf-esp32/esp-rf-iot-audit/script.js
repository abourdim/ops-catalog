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
  en:{title:'🔍 RF IoT Audit',subtitle:'WiFi+BLE+ESP-NOW Simultaneously',disconnected:'Idle',connected:'Auditing',mainSection:'3-Protocol Concurrent Monitor',mainDesc:'Audit WiFi, BLE, and ESP-NOW simultaneously',sectionA:'Protocol Distribution',sectionB:'Audit Report',sectionC:'Multi-Protocol Theory',startAudit:'Start Audit',stop:'Stop',theory1:'ESP32 can monitor WiFi, BLE, and ESP-NOW simultaneously using its dual-radio architecture and time-division multiplexing.',theory2:'WiFi scanning captures probe requests, beacons, and data frames. BLE scanning finds advertising devices. ESP-NOW listens for peer-to-peer messages.',theory3:'IoT auditing reveals all wireless devices in range, their protocols, signal strength, and communication patterns.',theory4:'Security audit flags include unencrypted ESP-NOW, open WiFi networks, and BLE devices broadcasting sensitive data.',splashHint:'tap to skip',ready:'🔍 RF IoT Audit ready!',langChanged:'Language → English',auditStarted:'Audit started — scanning 3 protocols',auditStopped:'Audit stopped'},
  fr:{title:'🔍 Audit RF IoT',subtitle:'WiFi+BLE+ESP-NOW Simultane',disconnected:'Inactif',connected:'Audit en cours',mainSection:'Moniteur 3 protocoles',mainDesc:'Auditez WiFi, BLE et ESP-NOW simultanement',sectionA:'Distribution des protocoles',sectionB:'Rapport d\'audit',sectionC:'Theorie multi-protocole',startAudit:'Demarrer audit',stop:'Arreter',theory1:'L\'ESP32 peut surveiller WiFi, BLE et ESP-NOW simultanement grace a son architecture double radio.',theory2:'Le scan WiFi capture les probes, beacons et trames de donnees. Le BLE trouve les appareils en publicite.',theory3:'L\'audit IoT revele tous les appareils sans fil a portee.',theory4:'Les alertes de securite incluent ESP-NOW non chiffre et reseaux WiFi ouverts.',splashHint:'appuyer pour passer',ready:'🔍 Audit RF IoT pret!',langChanged:'Langue → Francais',auditStarted:'Audit demarre',auditStopped:'Audit arrete'},
  ar:{title:'🔍 تدقيق RF IoT',subtitle:'WiFi+BLE+ESP-NOW في وقت واحد',disconnected:'خامل',connected:'جارٍ التدقيق',mainSection:'مراقب 3 بروتوكولات',mainDesc:'تدقيق WiFi وBLE وESP-NOW في وقت واحد',sectionA:'توزيع البروتوكولات',sectionB:'تقرير التدقيق',sectionC:'نظرية متعددة البروتوكولات',startAudit:'بدء التدقيق',stop:'إيقاف',theory1:'يمكن لـ ESP32 مراقبة WiFi وBLE وESP-NOW في وقت واحد باستخدام بنية الراديو المزدوجة.',theory2:'يلتقط مسح WiFi طلبات الاستكشاف والإشارات. يجد مسح BLE الأجهزة المعلنة.',theory3:'يكشف تدقيق IoT عن جميع الأجهزة اللاسلكية في النطاق.',theory4:'تشمل تنبيهات الأمان ESP-NOW غير المشفر وشبكات WiFi المفتوحة.',splashHint:'انقر للتخطي',ready:'🔍 تدقيق RF IoT جاهز!',langChanged:'اللغة ← العربية',auditStarted:'بدأ التدقيق',auditStopped:'توقف التدقيق'}
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
