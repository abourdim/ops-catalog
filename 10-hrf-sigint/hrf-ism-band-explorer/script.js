/**
 * ISM Band Explorer — Workshop DIY
 * Simulated 433/868/915 MHz ISM band scanning with device identification
 * Themes . i18n . RTL . Log . Toast . Status . Panels . Sound
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);break;case'success':osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);break;case'error':osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);break;}}

const LANG={
  en:{title:'ISM Band Explorer',subtitle:'📊 433/868/915 MHz devices',disconnected:'Disconnected',connected:'Connected',mainSection:'ISM Band Explorer',mainDesc:'Scan and identify ISM band devices',sectionA:'Device List',sectionB:'Protocol Identification',sectionC:'ISM Bands Explained',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What are ISM bands?',faq_a1:'Unlicensed radio bands at 433, 868, and 915 MHz used by weather stations, car keys, LoRa, and other IoT devices.',faq_q2:'Do I need hardware?',faq_a2:'No, this is a simulator. Real scanning uses rtl_433 with an RTL-SDR dongle.',faq_q3:'What protocols are shown?',faq_a3:'Weather stations, car key fobs, LoRa packets, garage openers, tire pressure sensors, and more.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser.',howto_1:'Click "Start Scanner" to begin ISM band scanning.',howto_2:'Select a band (433/868/915 MHz) to scan.',howto_3:'Watch devices appear in the list as they transmit.',howto_4:'Click a device to see protocol identification details.',wiki_ism_title:'📊 ISM Bands',wiki_ism:'Unlicensed bands for industrial/scientific/medical use.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'All data stays in your browser.',working:'Working...',ready:'📊 ISM Band Explorer ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',startScan:'Start Scanner',stopScan:'Stop',devicesFound:'devices',thDevice:'Device',thFreq:'Freq (MHz)',thProtocol:'Protocol',thSignal:'Signal',thLastSeen:'Last Seen',selectDevice:'Select a device to see protocol details',ismInfo:'ISM (Industrial, Scientific, Medical) bands are unlicensed radio frequency bands available for low-power devices. The 433 MHz band is used in Europe for weather stations, car key fobs, and garage door openers. The 868 MHz band serves LoRa, Sigfox, and other IoT protocols in Europe. The 915 MHz band is the US equivalent.',scanStarted:'📡 ISM scanner started on',scanStopped:'🔴 Scanner stopped',newDevice:'New device:',bandChanged:'📻 Band →'},
  fr:{title:'Explorateur ISM',subtitle:'📊 Appareils 433/868/915 MHz',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Explorateur de bandes ISM',mainDesc:'Scanner et identifier les appareils ISM',sectionA:'Liste des appareils',sectionB:'Identification protocole',sectionC:'Bandes ISM expliquees',activityLog:'Journal',eventsMsg:'Evenements et messages',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Que sont les bandes ISM ?',faq_a1:'Bandes radio non licenciees a 433, 868 et 915 MHz pour stations meteo, cles de voiture, LoRa et IoT.',faq_q2:'Ai-je besoin de materiel ?',faq_a2:'Non, c\'est un simulateur. Le vrai scan utilise rtl_433 avec un RTL-SDR.',faq_q3:'Quels protocoles ?',faq_a3:'Stations meteo, cles de voiture, LoRa, ouvre-portes, capteurs de pression pneus.',faq_q4:'Mes donnees sont privees ?',faq_a4:'Oui. Tout fonctionne localement.',howto_1:'Cliquez "Demarrer" pour lancer le scan ISM.',howto_2:'Selectionnez une bande (433/868/915 MHz).',howto_3:'Les appareils apparaissent quand ils emettent.',howto_4:'Cliquez un appareil pour voir les details du protocole.',wiki_ism_title:'📊 Bandes ISM',wiki_ism:'Bandes non licenciees pour usage industriel/scientifique/medical.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Tout reste dans votre navigateur.',working:'En cours...',ready:'📊 Explorateur ISM pret !',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',startScan:'Demarrer',stopScan:'Arreter',devicesFound:'appareils',thDevice:'Appareil',thFreq:'Freq (MHz)',thProtocol:'Protocole',thSignal:'Signal',thLastSeen:'Vu',selectDevice:'Selectionnez un appareil pour voir les details',ismInfo:'Les bandes ISM sont des bandes radio non licenciees pour appareils basse puissance.',scanStarted:'📡 Scanner ISM demarre sur',scanStopped:'🔴 Scanner arrete',newDevice:'Nouvel appareil :',bandChanged:'📻 Bande →'},
  ar:{title:'مستكشف نطاق ISM',subtitle:'📊 اجهزة 433/868/915 ميغاهرتز',disconnected:'غير متصل',connected:'متصل',mainSection:'مستكشف نطاق ISM',mainDesc:'مسح وتحديد اجهزة ISM',sectionA:'قائمة الاجهزة',sectionB:'تحديد البروتوكول',sectionC:'شرح نطاقات ISM',activityLog:'سجل النشاط',eventsMsg:'الاحداث والرسائل',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هي نطاقات ISM؟',faq_a1:'نطاقات راديو غير مرخصة عند 433 و868 و915 ميغاهرتز لمحطات الطقس ومفاتيح السيارات وLoRa.',faq_q2:'هل احتاج اجهزة؟',faq_a2:'لا، هذا محاكي. المسح الحقيقي يستخدم rtl_433 مع RTL-SDR.',faq_q3:'ما البروتوكولات المعروضة؟',faq_a3:'محطات طقس، مفاتيح سيارات، LoRa، فتاحات ابواب، حساسات ضغط اطارات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محليًا.',howto_1:'اضغط "بدء المسح" لبدء مسح ISM.',howto_2:'اختر نطاق (433/868/915 ميغاهرتز).',howto_3:'شاهد الاجهزة تظهر عند الارسال.',howto_4:'اضغط جهاز لرؤية تفاصيل البروتوكول.',wiki_ism_title:'📊 نطاقات ISM',wiki_ism:'نطاقات غير مرخصة للاستخدام الصناعي/العلمي/الطبي.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'كل البيانات تبقى في متصفحك.',working:'جارٍ...',ready:'📊 مستكشف ISM جاهز!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',startScan:'بدء المسح',stopScan:'ايقاف',devicesFound:'جهاز',thDevice:'الجهاز',thFreq:'التردد',thProtocol:'البروتوكول',thSignal:'الاشارة',thLastSeen:'اخر ظهور',selectDevice:'اختر جهاز لرؤية التفاصيل',ismInfo:'نطاقات ISM هي نطاقات راديو غير مرخصة لاجهزة الطاقة المنخفضة.',scanStarted:'📡 بدا مسح ISM على',scanStopped:'🔴 توقف المسح',newDevice:'جهاز جديد:',bandChanged:'📻 النطاق →'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}
function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}

let logContainer,typewriterEnabled=true;const logHistory=[];
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const fullText=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,fullText);}else{d.textContent=fullText;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');logHistory.push({msg,type,ts:Date.now()});applyLogFilter();}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(8+Math.random()*12);}el.classList.remove('typing');}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const text=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const blob=new Blob([text],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`ism-explorer-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab,tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const target=$(tid);if(target)target.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let whisperActive=false;function toggleWhisper(){whisperActive=!whisperActive;log(whisperActive?'🎤 Whisper mode on':'🎤 Whisper mode off','info');}
let breathingActive=false;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 Breathing guide on':'🫁 Breathing guide off','info');}
let dhikrCount=0;function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;playSound('click');}
function toggleMusicMode(){log('🎵 Music mode toggled','info');}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return;}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){const ch=ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)];ctx.fillText(ch,i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;
function initMatrixTrigger(){const logo=$('logoWrap');if(!logo)return;logo.style.cursor='pointer';logo.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else{logoClickTimer=setTimeout(()=>logoClickCount=0,500);}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI CODE — RETRO!','success');}}else konamiIdx=0;});}

/* =======================================================================
   ISM BAND EXPLORER — SIMULATION ENGINE
   ======================================================================= */

const ISM_DEVICES = {
  '433': [
    {name:'Acurite Weather Station',protocol:'Acurite 5n1',modulation:'OOK',dataRate:'~1 kbps',info:'Temperature, humidity, wind speed, rain gauge. OOK modulated.'},
    {name:'Car Key Fob (Toyota)',protocol:'Rolling Code OOK',modulation:'OOK',dataRate:'2.4 kbps',info:'Rolling code transmitter, 433.92 MHz, OOK modulation with Manchester encoding.'},
    {name:'Garage Door Opener',protocol:'Fixed Code',modulation:'OOK',dataRate:'1 kbps',info:'Simple fixed-code OOK transmitter. Easily replayed — insecure.'},
    {name:'Oregon Scientific THN132N',protocol:'Oregon v2.1',modulation:'OOK-PWM',dataRate:'1024 bps',info:'Temperature sensor with Oregon Scientific v2.1 protocol, OOK-PWM modulation.'},
    {name:'TPMS Sensor (Schrader)',protocol:'Schrader TPMS',modulation:'FSK',dataRate:'9.6 kbps',info:'Tire pressure monitoring system. FSK modulated, sends pressure and temperature.'},
    {name:'Wireless Doorbell',protocol:'EV1527',modulation:'OOK',dataRate:'~1 kbps',info:'Simple OOK transmitter with EV1527 encoding chip. 24-bit address.'},
    {name:'Soil Moisture Sensor',protocol:'Fine Offset WH51',modulation:'FSK',dataRate:'17.2 kbps',info:'Soil moisture and temperature for garden automation.'},
    {name:'LaCrosse TX141',protocol:'LaCrosse TX',modulation:'OOK',dataRate:'~1 kbps',info:'Outdoor temperature/humidity sensor.'},
  ],
  '868': [
    {name:'LoRa Gateway Beacon',protocol:'LoRaWAN',modulation:'CSS (LoRa)',dataRate:'0.3-50 kbps',info:'LoRa chirp spread spectrum. Long range, low power IoT protocol. EU868 band.'},
    {name:'Sigfox Device',protocol:'Sigfox',modulation:'DBPSK',dataRate:'100 bps',info:'Ultra-narrow-band IoT protocol. 12 bytes per message max.'},
    {name:'Smart Meter (Wireless M-Bus)',protocol:'Wireless M-Bus',modulation:'FSK',dataRate:'100 kbps',info:'European smart metering protocol for gas/water/electricity meters.'},
    {name:'LoRa Soil Sensor',protocol:'LoRaWAN ABP',modulation:'CSS (LoRa)',dataRate:'5.5 kbps',info:'Agricultural soil monitoring over LoRaWAN, SF7 spreading factor.'},
    {name:'Home Alarm System',protocol:'SIA DC-05',modulation:'FSK',dataRate:'9.6 kbps',info:'European home security alarm panel communication.'},
    {name:'EnOcean Switch',protocol:'EnOcean ESP3',modulation:'ASK',dataRate:'125 kbps',info:'Energy harvesting wireless switch, no battery required.'},
  ],
  '915': [
    {name:'LoRa Node (US)',protocol:'LoRaWAN',modulation:'CSS (LoRa)',dataRate:'0.3-50 kbps',info:'LoRa chirp spread spectrum on US915 band. 64+8 uplink channels.'},
    {name:'Zigbee Sensor',protocol:'Zigbee 3.0',modulation:'O-QPSK',dataRate:'250 kbps',info:'Zigbee mesh network sensor. IEEE 802.15.4 physical layer.'},
    {name:'Z-Wave Thermostat',protocol:'Z-Wave',modulation:'FSK',dataRate:'100 kbps',info:'Z-Wave home automation protocol, US frequency plan.'},
    {name:'Amazon Sidewalk',protocol:'Sidewalk FSK',modulation:'GFSK',dataRate:'50 kbps',info:'Amazon neighborhood mesh network for IoT devices.'},
    {name:'RFID Tag Reader',protocol:'ISO 18000-6C',modulation:'ASK/PIE',dataRate:'640 kbps',info:'UHF RFID reader, Gen2 protocol for inventory tracking.'},
  ]
};

let simRunning=false,simInterval=null,animFrame=null;
let currentBand='433';
let devices=[];
let selectedDevice=null;
let spectrumData=new Float32Array(256);

function gaussNoise(){let u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

function generateSpectrum(){
  const bandCenter=parseInt(currentBand);
  const bw=2; // MHz bandwidth
  for(let i=0;i<256;i++){
    spectrumData[i]=-85+gaussNoise()*3;
  }
  // Add device bursts
  devices.forEach(dev=>{
    if(Math.random()>0.6)return;
    const offset=((dev.freq-bandCenter+bw/2)/bw)*256;
    const width=3+Math.random()*8;
    const height=15+Math.random()*25;
    for(let i=0;i<256;i++){
      const dist=(i-offset)/width;
      spectrumData[i]+=height*Math.exp(-0.5*dist*dist);
    }
    dev.lastSignal=-85+height+gaussNoise()*2;
    dev.lastSeen=new Date().toLocaleTimeString();
  });
}

function createDevice(){
  const bandDevices=ISM_DEVICES[currentBand];
  if(!bandDevices||bandDevices.length===0)return null;
  const template=bandDevices[Math.floor(Math.random()*bandDevices.length)];
  const bandCenter=parseInt(currentBand);
  const freq=bandCenter-0.8+Math.random()*1.6;
  return{
    id:Math.random().toString(36).slice(2,8),
    name:template.name,
    protocol:template.protocol,
    modulation:template.modulation,
    dataRate:template.dataRate,
    info:template.info,
    freq:parseFloat(freq.toFixed(3)),
    lastSignal:-70+Math.random()*20,
    lastSeen:new Date().toLocaleTimeString(),
    band:currentBand
  };
}

function simTick(){
  // Possibly add a new device
  if(Math.random()<0.2&&devices.filter(d=>d.band===currentBand).length<12){
    const dev=createDevice();
    if(dev){
      devices.push(dev);
      log(`${LANG[currentLang].newDevice} ${dev.name} @ ${dev.freq} MHz [${dev.protocol}]`,'rx');
    }
  }
  generateSpectrum();
  updateDeviceTable();
  updateDeviceCount();
}

function updateDeviceCount(){
  const el=$('deviceCount');
  const count=devices.filter(d=>d.band===currentBand).length;
  if(el)el.innerHTML=`${count} <span data-i18n="devicesFound">${LANG[currentLang].devicesFound}</span>`;
}

function updateDeviceTable(){
  const tbody=$('deviceBody');if(!tbody)return;tbody.innerHTML='';
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  devices.filter(d=>d.band===currentBand).forEach(dev=>{
    const tr=document.createElement('tr');
    const isSel=selectedDevice&&selectedDevice.id===dev.id;
    tr.style.borderBottom='1px solid rgba(255,255,255,0.05)';
    if(isSel)tr.style.color=accent;
    tr.style.cursor='pointer';
    const signalBars=dev.lastSignal>-60?'█████':dev.lastSignal>-70?'████':dev.lastSignal>-80?'███':'██';
    const signalColor=dev.lastSignal>-60?'#81c784':dev.lastSignal>-70?'#ffb74d':'#e57373';
    tr.innerHTML=`<td style="padding:4px 8px">${dev.name}</td><td style="padding:4px 8px">${dev.freq}</td><td style="padding:4px 8px">${dev.protocol}</td><td style="padding:4px 8px;color:${signalColor}">${signalBars} ${dev.lastSignal.toFixed(0)} dBm</td><td style="padding:4px 8px">${dev.lastSeen}</td>`;
    tr.onclick=()=>selectDevice(dev);
    tbody.appendChild(tr);
  });
}

function selectDevice(dev){
  selectedDevice=dev;
  const info=$('protocolInfo');if(!info)return;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  info.innerHTML=`
    <div style="color:${accent};font-size:.9rem;margin-bottom:8px;font-weight:bold;">${dev.name}</div>
    <div><span style="opacity:.5;">Protocol:</span> ${dev.protocol}</div>
    <div><span style="opacity:.5;">Modulation:</span> ${dev.modulation}</div>
    <div><span style="opacity:.5;">Data Rate:</span> ${dev.dataRate}</div>
    <div><span style="opacity:.5;">Frequency:</span> ${dev.freq} MHz</div>
    <div><span style="opacity:.5;">Signal:</span> ${dev.lastSignal.toFixed(1)} dBm</div>
    <div style="margin-top:8px;opacity:.7;font-size:.7rem;">${dev.info}</div>
  `;
  log(`🔍 Selected ${dev.name} — ${dev.protocol} @ ${dev.freq} MHz`,'info');
}

/* ======= SPECTRUM DRAWING ======= */
function drawSpectrum(){
  const canvas=$('spectrumCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');const W=canvas.width,H=canvas.height;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,W,H);
  // Grid
  ctx.strokeStyle='rgba(100,200,255,0.06)';ctx.lineWidth=1;
  for(let i=0;i<=8;i++){const x=(i/8)*W;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let i=0;i<=4;i++){const y=(i/4)*H;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // Freq labels
  const bandCenter=parseInt(currentBand);
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='9px Orbitron, monospace';ctx.textAlign='center';
  for(let i=0;i<=8;i++){const f=bandCenter-1+(i/8)*2;ctx.fillText(f.toFixed(2),(i/8)*W,H-4);}
  // Spectrum line
  const minDb=-95,maxDb=-40;
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<256;i++){const x=(i/256)*W;const y=H-((spectrumData[i]-minDb)/(maxDb-minDb))*(H-20);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.stroke();ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();
  ctx.fillStyle=accent.replace(')',',0.08)').replace('rgb','rgba');ctx.fill();
  // Label
  ctx.fillStyle='rgba(100,200,255,0.4)';ctx.font='10px Orbitron, monospace';ctx.textAlign='left';
  ctx.fillText(`ISM ${currentBand} MHz | BW: 2 MHz | rtl_433 sim`,8,12);
}

function drawLoop(){if(!simRunning)return;drawSpectrum();animFrame=requestAnimationFrame(drawLoop);}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  log(`${LANG[currentLang].scanStarted} ${currentBand} MHz`,'success');
  // Seed some devices
  for(let i=0;i<3+Math.floor(Math.random()*3);i++){const dev=createDevice();if(dev)devices.push(dev);}
  updateDeviceTable();updateDeviceCount();
  simInterval=setInterval(simTick,2000);drawLoop();
}

function stopSim(){
  if(!simRunning)return;simRunning=false;setStatus(false);
  if(simInterval){clearInterval(simInterval);simInterval=null;}
  if(animFrame){cancelAnimationFrame(animFrame);animFrame=null;}
  log(LANG[currentLang].scanStopped,'info');
}

function changeBand(band){
  currentBand=band;
  log(`${LANG[currentLang].bandChanged} ${band} MHz`,'info');
  playSound('click');
  if(simRunning){stopSim();devices=devices.filter(d=>d.band!==band);startSim();}
}

/* ======= INIT ======= */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();
  // App-specific
  const startBtn=$('startBtn'),stopBtn=$('stopBtn');
  if(startBtn)startBtn.onclick=startSim;if(stopBtn)stopBtn.onclick=stopSim;
  const bandSel=$('bandSelect');if(bandSel)bandSel.addEventListener('change',()=>changeBand(bandSel.value));
  drawSpectrum();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — ISM Band Explorer
   Animated device pulse map + protocol decoder waterfall
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,on=false,af=null,t=0;
const particles=[];
function boot(){
  let el=document.getElementById('ismSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='ismSimCanvas';el.width=780;el.height=240;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060c18;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function addPulse(){
  if(typeof devices==='undefined'||devices.length===0)return;
  const d=devices[Math.floor(Math.random()*devices.length)];
  particles.push({x:Math.random()*W,y:H*.3+Math.random()*H*.5,r:2,maxR:15+Math.random()*25,
    color:d.lastSignal>-60?'#81c784':d.lastSignal>-70?'#ffb74d':'#e57373',
    name:d.name.slice(0,12),proto:d.protocol,life:1,speed:.02+Math.random()*.02});
}
function tick(){
  if(!on)return;t+=.016;
  if(Math.random()<.15)addPulse();
  cx.fillStyle='rgba(6,12,24,.15)';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Draw frequency ruler
  cx.strokeStyle='rgba(100,200,255,.06)';cx.lineWidth=.5;
  for(let i=0;i<=8;i++){const x=i/8*W;cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}
  // Particles
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];p.r+=.5;p.life-=p.speed;
    if(p.life<=0){particles.splice(i,1);continue;}
    cx.strokeStyle=p.color.replace(')',`,${p.life*.5})`).replace('rgb','rgba');
    cx.lineWidth=1.5;cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.stroke();
    if(p.r<p.maxR*.3){cx.fillStyle=p.color.replace(')',`,${p.life*.8})`).replace('rgb','rgba');
    cx.beginPath();cx.arc(p.x,p.y,3,0,Math.PI*2);cx.fill();}
    cx.fillStyle=`rgba(200,230,255,${p.life*.5})`;cx.font='8px monospace';cx.textAlign='center';
    cx.fillText(p.proto,p.x,p.y-p.r-4);
  }
  // Moving band indicator
  const bandX=(Math.sin(t*.5)*.5+.5)*W;
  cx.strokeStyle=acc+'44';cx.lineWidth=20;cx.globalAlpha=.08;
  cx.beginPath();cx.moveTo(bandX,0);cx.lineTo(bandX,H);cx.stroke();cx.globalAlpha=1;
  // Protocol decode ticker at bottom
  cx.fillStyle='rgba(0,0,0,.6)';cx.fillRect(0,H-22,W,22);
  const band=typeof currentBand!=='undefined'?currentBand:'433';
  const cnt=typeof devices!=='undefined'?devices.filter(d=>d.band===band).length:0;
  cx.fillStyle='rgba(100,200,255,.5)';cx.font='10px Orbitron,monospace';cx.textAlign='left';
  cx.fillText(`ISM ${band} MHz | ${cnt} active devices | Protocol pulses`,8,H-7);
  cx.textAlign='right';cx.fillText('rtl_433 sim',W-8,H-7);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();on=true;tick();},600);
})();
