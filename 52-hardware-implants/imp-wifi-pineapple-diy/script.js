/**
 * imp-wifi-pineapple-diy — Workshop DIY
 * DIY WiFi Pineapple rogue AP simulation for wireless security training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2"/><path d="M35 55 Q50 25 65 55" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="60" r="5" fill="currentColor"/><path d="M30 40 Q50 10 70 40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><line x1="50" y1="65" x2="50" y2="85" stroke="currentColor" stroke-width="2"/><line x1="42" y1="85" x2="58" y2="85" stroke="currentColor" stroke-width="2"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08)}else if(type==='success'){osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25)}}

const LANG={
  en:{title:'imp-wifi-pineapple-diy',subtitle:'📶 broadcast · 🎣 capture · 🛡️ detect',disconnected:'Disconnected',connected:'Connected',mainSection:'WiFi Pineapple DIY — Rogue AP Lab',mainDesc:'Build a DIY rogue access point and learn evil twin detection',sectionA:'How It Works',sectionB:'Lab — Wireless Topology',sectionC:'Challenge',broadcastBtn:'Broadcast AP',captureBtn:'Capture Creds',detectBtn:'Detect Rogue AP',howStep1:'A WiFi Pineapple creates an evil twin access point mimicking legitimate networks.',howStep2:'Clients auto-connect to the rogue AP, routing all traffic through the attacker.',howStep3:'Captive portals capture credentials; SSL stripping downgrades HTTPS connections.',howStep4:'Detection uses beacon frame analysis, BSSID monitoring, and wireless IDS (WIDS).',ready:'📶 WiFi Pineapple DIY ready — select attack mode!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working…',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',splashHint:'tap to skip',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},
  fr:{title:'imp-wifi-pineapple-diy',subtitle:'📶 diffuser · 🎣 capturer · 🛡️ détecter',disconnected:'Déconnecté',connected:'Connecté',mainSection:'WiFi Pineapple DIY — Point d\'accès pirate',mainDesc:'Construisez un point d\'accès pirate DIY',sectionA:'Comment ça marche',sectionB:'Labo — Topologie sans fil',sectionC:'Défi',broadcastBtn:'Diffuser',captureBtn:'Capturer',detectBtn:'Détecter',ready:'📶 WiFi Pineapple prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',working:'En cours…',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',splashHint:'appuyer pour passer',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},
  ar:{title:'imp-wifi-pineapple-diy',subtitle:'📶 بث · 🎣 التقاط · 🛡️ كشف',disconnected:'غير متصل',connected:'متصل',mainSection:'WiFi Pineapple — مختبر نقطة الوصول المزيفة',mainDesc:'بناء نقطة وصول مزيفة وتعلم كشف التوائم الشريرة',sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',broadcastBtn:'بث',captureBtn:'التقاط',detectBtn:'كشف',ready:'📶 WiFi Pineapple جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',working:'جارٍ…',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',splashHint:'انقر للتخطي',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch{}log(s.langChanged,'info')}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click()}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter()})})}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=(activeLogFilter==='all'||line.classList.contains(activeLogFilter))?'':'none'})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open')}function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}function openSettings(){openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay')}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')})})}
function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click')}
let matrixRunning=false,matrixAnim=null;function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=innerWidth;canvas.height=innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);const chars='بسمالرحنيوكلتعدفقثصضطظغشزخجذ01';(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)})()}

/* ═══════ APP-SPECIFIC: WIFI PINEAPPLE DIY ═══════ */
let broadcasting=false;
let wifiParticles=[];
let connectedClients=[];
let waveTime=0;

const ssidNames=['FreeWiFi','Starbucks_WiFi','Airport_Free','Hotel_Guest','Company_Corp'];
function randomMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()).join(':')}
function randomClient(){
  const devices=['iPhone 14','Galaxy S23','MacBook Pro','ThinkPad X1','iPad Air','Pixel 7'];
  return{device:devices[Math.floor(Math.random()*devices.length)],mac:randomMAC(),ip:`192.168.1.${Math.floor(Math.random()*200)+10}`,signal:-(30+Math.floor(Math.random()*50)),timestamp:new Date().toLocaleTimeString()};
}

function initSimCanvas(){
  const canvas=$('simCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||500;canvas.height=260;

  function draw(){
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    waveTime+=0.02;

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=0.5;
    for(let x=0;x<canvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}
    for(let y=0;y<canvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}

    // Pineapple AP (center)
    const apX=canvas.width/2,apY=80;
    ctx.fillStyle='#220000';ctx.strokeStyle=broadcasting?'#ff3333':'#333';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(apX-30,apY-18,60,36,6);ctx.fill();ctx.stroke();
    ctx.fillStyle=broadcasting?'#ff3333':'#666';ctx.font='8px Orbitron';ctx.textAlign='center';
    ctx.fillText('EVIL TWIN',apX,apY+3);
    ctx.fillText(broadcasting?'ON AIR':'OFFLINE',apX,apY+13);
    ctx.textAlign='left';

    // Broadcast waves
    if(broadcasting){
      for(let w=0;w<4;w++){
        const phase=(waveTime*2+w*1.5)%6;const r=phase/6*80;const alpha=1-phase/6;
        ctx.strokeStyle=`rgba(255,51,51,${alpha*0.3})`;ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(apX,apY,20+r,0,Math.PI*2);ctx.stroke();
      }
      // SSID label
      const ssid=($('ssidInput')||{}).value||'FreeWiFi';
      ctx.fillStyle='#ff6600';ctx.font='10px Orbitron';ctx.textAlign='center';
      ctx.fillText(`SSID: "${ssid}"`,apX,25);ctx.textAlign='left';
    }

    // Legitimate AP (top-right corner)
    ctx.fillStyle='#001122';ctx.strokeStyle='#33ff33';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.roundRect(canvas.width-90,15,60,28,4);ctx.fill();ctx.stroke();
    ctx.fillStyle='#33ff33';ctx.font='7px Orbitron';ctx.fillText('LEGIT AP',canvas.width-85,33);

    // Connected clients (bottom)
    connectedClients.slice(-4).forEach((client,i)=>{
      const cx=60+i*110,cy=canvas.height-60;
      ctx.fillStyle='#111';ctx.strokeStyle='#4488ff';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(cx-25,cy-12,50,24,3);ctx.fill();ctx.stroke();
      ctx.fillStyle='#4488ff';ctx.font='6px Orbitron';ctx.textAlign='center';
      ctx.fillText(client.device.slice(0,8),cx,cy+3);ctx.textAlign='left';

      // Connection line to evil AP
      if(broadcasting){
        ctx.strokeStyle='rgba(255,51,51,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,5]);
        ctx.beginPath();ctx.moveTo(cx,cy-12);ctx.lineTo(apX,apY+18);ctx.stroke();ctx.setLineDash([]);
      }
    });

    // Particles
    for(let i=wifiParticles.length-1;i>=0;i--){
      const p=wifiParticles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.015;
      if(p.life<=0){wifiParticles.splice(i,1);continue}
      ctx.globalAlpha=p.life;ctx.fillStyle=p.color||'#ff3333';
      ctx.beginPath();ctx.arc(p.x,p.y,p.size||2,0,Math.PI*2);ctx.fill();
      if(p.label){ctx.font='6px Orbitron';ctx.fillText(p.label,p.x+4,p.y-2)}
      ctx.globalAlpha=1;
    }

    // Status bar
    const ch=parseInt(($('channelSlider')||{}).value||'6');
    ctx.fillStyle=broadcasting?'rgba(255,51,51,0.15)':'rgba(51,255,51,0.1)';
    ctx.fillRect(50,canvas.height-20,canvas.width-100,8);
    ctx.fillStyle=broadcasting?'#ff3333':'#33ff33';ctx.font='8px Orbitron';
    ctx.fillText(`CH: ${ch} | CLIENTS: ${connectedClients.length} | 2.4 GHz`,50,canvas.height-6);

    requestAnimationFrame(draw);
  }draw();
}

function spawnWifiParticles(count,color){
  const canvas=$('simCanvas');if(!canvas)return;const cx=canvas.width/2;
  const labels=['BEACON','PROBE','AUTH','ASSOC','DEAUTH','DATA','EAPOL'];
  for(let i=0;i<count;i++){
    wifiParticles.push({x:cx+(Math.random()-0.5)*40,y:80+Math.random()*20,vx:(Math.random()-0.5)*4,vy:1+Math.random()*2,life:0.4+Math.random()*0.4,color:color||'#ff3333',size:2+Math.random()*2,label:Math.random()>0.6?labels[Math.floor(Math.random()*labels.length)]:null});
  }
}

function initWifiSim(){
  const broadcastBtn=$('broadcastBtn'),captureBtn=$('captureBtn'),detectBtn=$('detectBtn');
  const channelSlider=$('channelSlider'),channelValue=$('channelValue');
  const outputDisplay=$('outputDisplay'),dataLog=$('dataLog');
  const implantDot=$('implantDot'),implantStatusText=$('implantStatusText');

  if(channelSlider&&channelValue)channelSlider.addEventListener('input',()=>{channelValue.textContent='CH '+channelSlider.value});

  let broadcastIv=null;
  if(broadcastBtn)broadcastBtn.addEventListener('click',()=>{
    broadcasting=!broadcasting;
    broadcastBtn.textContent=broadcasting?'Stop AP':(LANG[currentLang].broadcastBtn||'Broadcast AP');
    if(implantDot)implantDot.classList.toggle('active',broadcasting);
    if(implantStatusText)implantStatusText.textContent=broadcasting?'AP: BROADCASTING':'AP: Offline';
    setStatus(broadcasting);

    if(broadcasting){
      const ssid=($('ssidInput')||{}).value||'FreeWiFi';
      log(`📶 Evil twin AP "${ssid}" broadcasting on CH ${($('channelSlider')||{}).value||6}`,'success');
      showToast('Broadcasting rogue AP...',1500);
      spawnWifiParticles(15,'#ff3333');
      broadcastIv=setInterval(()=>{
        if(!broadcasting){clearInterval(broadcastIv);return}
        const client=randomClient();connectedClients.push(client);
        spawnWifiParticles(5,'#4488ff');
        if(dataLog)dataLog.textContent=connectedClients.slice(-6).map(c=>`[${c.timestamp}] ${c.device} ${c.mac} ${c.signal}dBm`).join('\n');
        log(`📶 Client connected: ${client.device} (${client.mac})`,'rx');
      },3000);
    }else{
      if(broadcastIv)clearInterval(broadcastIv);
      log('⬛ Evil twin AP shut down','info');connectedClients=[];
    }
  });

  if(captureBtn)captureBtn.addEventListener('click',()=>{
    if(connectedClients.length===0){log('No clients connected','error');return}
    showToast('Launching captive portal...',2500);log('🎣 Captive portal active — capturing credentials...','info');
    spawnWifiParticles(20,'#ff6600');
    setTimeout(()=>{
      const users=['admin','jsmith','ahmed.k','cmartin','user1'];
      const domains=['company.com','gmail.com','outlook.com'];
      const result=['CAPTURED CREDENTIALS','══════════════════'];
      for(let i=0;i<2+Math.floor(Math.random()*3);i++){
        result.push(`${users[Math.floor(Math.random()*users.length)]}@${domains[Math.floor(Math.random()*domains.length)]} : ${'*'.repeat(8+Math.floor(Math.random()*4))}`);
      }
      result.push('','DNS queries intercepted: '+(50+Math.floor(Math.random()*200)),'HTTP sessions hijacked: '+(3+Math.floor(Math.random()*8)),'SSL strip attempts: '+(1+Math.floor(Math.random()*5)));
      if(outputDisplay)outputDisplay.textContent=result.join('\n');
      log('🎣 Credentials captured via captive portal!','success');hideToast();
    },2000);
  });

  if(detectBtn)detectBtn.addEventListener('click',()=>{
    showToast('Scanning for rogue APs...',2500);log('🛡️ Wireless IDS scan initiated...','info');
    spawnWifiParticles(25,'#33ff33');
    setTimeout(()=>{
      const found=broadcasting;
      if(outputDisplay)outputDisplay.textContent=(found?['⚠️ ROGUE AP DETECTED','══════════════════','SSID: '+($('ssidInput')||{}).value,'BSSID: '+randomMAC(),'Channel: '+($('channelSlider')||{}).value,'Signal: -25 dBm (suspiciously strong)','Encryption: OPEN (no WPA!)','','INDICATORS:','• Duplicate SSID with different BSSID','• No encryption on known-encrypted SSID','• Deauth frames detected nearby','• Captive portal redirect active']:['✅ NO ROGUE APs DETECTED','══════════════════','All APs match known BSSID list','Encryption: WPA3 on all networks','No deauth floods detected','No captive portal redirects','','Wireless environment appears clean.']).join('\n');
      log(found?'🚨 Rogue access point detected!':'✅ No rogue APs found',found?'error':'success');hideToast();
    },2000);
  });

  const sweepBtn=$('sweepBtn');
  if(sweepBtn)sweepBtn.addEventListener('click',()=>{spawnWifiParticles(30,'#d4a03c');log('📡 WiFi channel survey...','info');showToast('Surveying channels...',3000);let step=0;const chs=['CH 1 (2.412 GHz)','CH 6 (2.437 GHz)','CH 11 (2.462 GHz)','CH 36 (5.180 GHz)','CH 149 (5.745 GHz)'];const iv=setInterval(()=>{if(step<chs.length){if(dataLog)dataLog.textContent+=`\n[SURVEY] ${chs[step]} — ${Math.floor(Math.random()*10)} APs`;step++}else{clearInterval(iv);log('📡 Channel survey complete','success')}},500)});
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn')&&($('clearLogBtn').onclick=clearLog);$('copyLogBtn')&&($('copyLogBtn').onclick=copyLog);$('exportLogBtn')&&($('exportLogBtn').onclick=exportLog);initLogFilters();
  $('helpBtn')&&($('helpBtn').onclick=openHelp);$('helpCloseBtn')&&($('helpCloseBtn').onclick=closeHelp);$('helpOverlay')&&($('helpOverlay').onclick=closeHelp);initHelpTabs();
  $('settingsBtn')&&($('settingsBtn').onclick=openSettings);$('settingsCloseBtn')&&($('settingsCloseBtn').onclick=closeSettings);$('settingsOverlay')&&($('settingsOverlay').onclick=closeSettings);
  $('logBtn')&&($('logBtn').onclick=toggleLog);$('logCloseBtn')&&($('logCloseBtn').onclick=closeLog);
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch{}
  initHijriDate();initSimCanvas();initWifiSim();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
