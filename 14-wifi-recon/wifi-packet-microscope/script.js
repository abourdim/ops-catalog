/**
 * Packet Microscope — Frame Dissector
 * Hex dump, color-coded fields
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
const LANG={
en:{title:'Packet Microscope — Frame Dissector',subtitle:'Dissect every byte of an 802.11 frame',disconnected:'Disconnected',connected:'Capturing',mainSection:'Frame Dissector',mainDesc:'Hex dump with color-coded 802.11 fields',sectionA:'Captured Frames',sectionB:'Frame Type Statistics',sectionC:'How It Works',start:'Capture',stop:'Stop',howItWorksText:'Every 802.11 frame begins with a Frame Control field (2 bytes) that identifies the frame type and subtype. The Duration field (2 bytes) reserves airtime. Three MAC addresses follow: Destination (Addr1), Source (Addr2), and BSSID (Addr3). The Sequence Control field tracks frame ordering. The body contains the payload, and the FCS (Frame Check Sequence) provides error detection. This simulation generates realistic frames and color-codes each field for easy identification.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Click Capture to generate frames.',howto_2:'See the color-coded hex dump.',howto_3:'Click any captured frame to dissect it.',howto_4:'Review decoded field values below.',wiki_frame_title:'802.11 Frames',wiki_frame:'Header (FC, Duration, Addresses, Seq), body, and FCS.',wiki_hex_title:'Hex Dump',wiki_hex:'Raw bytes in hexadecimal for byte-level analysis.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Packet Microscope ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Capture started',simStopped:'Capture stopped',newFrame:'Frame captured',step1Title:'Scan Airwaves',step1Desc:'WiFi adapter scans all channels to discover nearby access points and clients.',step2Title:'Identify Targets',step2Desc:'Detected devices are fingerprinted by MAC, SSID, signal strength, and encryption type.',step3Title:'Analyze Traffic',step3Desc:'Captured frames are decoded to reveal communication patterns and vulnerabilities.',step4Title:'Detect Threats',step4Desc:'Security analysis identifies rogue APs, weak encryption, and suspicious activity.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates WiFi! 🔬 You get to experiment with WiFi signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real WiFi signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real wireless networks! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Wifi Handshake Theater and Wifi Probe Tracker! Each teaches something different. 🚀'},
fr:{title:'Microscope a Paquets — Dissecteur',subtitle:'Dissequez chaque octet d\'une trame 802.11',disconnected:'Deconnecte',connected:'Capture',mainSection:'Dissecteur de Trames',mainDesc:'Dump hexadecimal avec champs colores',sectionA:'Trames Capturees',sectionB:'Statistiques de Trames',sectionC:'Comment ca marche',start:'Capturer',stop:'Arreter',howItWorksText:'Chaque trame 802.11 commence par un champ Frame Control (2 octets). Le champ Duration reserve du temps d\'antenne. Trois adresses MAC suivent. Le corps contient les donnees et le FCS detecte les erreurs.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Cliquez Capturer.',howto_2:'Voyez le dump hexadecimal.',howto_3:'Cliquez une trame.',howto_4:'Consultez les valeurs.',wiki_frame_title:'Trames 802.11',wiki_frame:'En-tete, corps et FCS.',wiki_hex_title:'Dump Hex',wiki_hex:'Octets bruts en hexadecimal.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Capture demarree',simStopped:'Arretee',newFrame:'Trame capturee',step1Title:'Scanner les ondes',step1Desc:'L\'adaptateur WiFi scanne tous les canaux pour découvrir les points d\'accès.',step2Title:'Identifier les cibles',step2Desc:'Les appareils détectés sont identifiés par MAC, SSID et puissance du signal.',step3Title:'Analyser le trafic',step3Desc:'Les trames capturées sont décodées pour révéler les schémas de communication.',step4Title:'Détecter les menaces',step4Desc:'L\'analyse de sécurité identifie les AP pirates et les faiblesses.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule WiFi ! 🔬 Tu peux expérimenter avec WiFi signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais WiFi signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai wireless networks ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Wifi Handshake Theater and Wifi Probe Tracker ! Chacune enseigne quelque chose de différent. 🚀'},
ar:{title:'مجهر الحزم — محلل الإطارات',subtitle:'حلل كل بايت من إطار 802.11',disconnected:'غير متصل',connected:'التقاط',mainSection:'محلل الإطارات',mainDesc:'عرض سداسي مع حقول ملونة',sectionA:'الإطارات الملتقطة',sectionB:'إحصائيات أنواع الإطارات',sectionC:'كيف يعمل',start:'التقاط',stop:'إيقاف',howItWorksText:'كل إطار 802.11 يبدأ بحقل التحكم (2 بايت) يحدد نوع الإطار. حقل المدة يحجز وقت البث. ثلاثة عناوين MAC تتبع. الجسم يحتوي البيانات وFCS يكشف الأخطاء.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'انقر التقاط.',howto_2:'شاهد العرض السداسي الملون.',howto_3:'انقر إطاراً لتحليله.',howto_4:'راجع قيم الحقول.',wiki_frame_title:'إطارات 802.11',wiki_frame:'رأس وجسم وFCS.',wiki_hex_title:'عرض سداسي',wiki_hex:'بايتات خام بالست عشري.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'مجهر الحزم جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ الالتقاط',simStopped:'توقف',newFrame:'إطار ملتقط',step1Title:'مسح الموجات',step1Desc:'يفحص محول WiFi جميع القنوات لاكتشاف نقاط الوصول القريبة.',step2Title:'تحديد الأهداف',step2Desc:'يتم تحديد الأجهزة المكتشفة بواسطة MAC و SSID وقوة الإشارة.',step3Title:'تحليل حركة البيانات',step3Desc:'يتم فك تشفير الإطارات الملتقطة لكشف أنماط الاتصال.',step4Title:'كشف التهديدات',step4Desc:'يحدد التحليل الأمني نقاط الوصول المزيفة ونقاط الضعف.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي WiFi! 🔬 يمكنك التجربة مع WiFi signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج WiFi signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا wireless networks حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Wifi Handshake Theater and Wifi Probe Tracker! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
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
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`packet-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Packet Microscope ═══════ */
function rH(n){return Array.from({length:n},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(' ')}
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':')}
const FRAME_DEFS=[
  {type:'mgmt',subtype:'Beacon',fc:'80 00',label:'Management/Beacon'},
  {type:'mgmt',subtype:'Probe Req',fc:'40 00',label:'Management/Probe Request'},
  {type:'mgmt',subtype:'Probe Resp',fc:'50 00',label:'Management/Probe Response'},
  {type:'mgmt',subtype:'Auth',fc:'b0 00',label:'Management/Authentication'},
  {type:'mgmt',subtype:'Assoc Req',fc:'00 00',label:'Management/Association Request'},
  {type:'ctrl',subtype:'ACK',fc:'d4 00',label:'Control/ACK'},
  {type:'ctrl',subtype:'RTS',fc:'b4 00',label:'Control/RTS'},
  {type:'ctrl',subtype:'CTS',fc:'c4 00',label:'Control/CTS'},
  {type:'data',subtype:'Data',fc:'08 01',label:'Data'},
  {type:'data',subtype:'QoS Data',fc:'88 01',label:'Data/QoS'},
];
let simRunning=false,simInterval=null,frames=[],stats={mgmt:0,ctrl:0,data:0};

function genFrame(){
  const def=FRAME_DEFS[Math.floor(Math.random()*FRAME_DEFS.length)];
  const fc=def.fc;const dur=rH(2);
  const addr1=randMAC().replace(/:/g,' ');const addr2=randMAC().replace(/:/g,' ');const addr3=randMAC().replace(/:/g,' ');
  const seq=rH(2);const bodyLen=8+Math.floor(Math.random()*24);const body=rH(bodyLen);const fcs=rH(4);
  return{def,fc,dur,addr1,addr2,addr3,seq,body,fcs,time:new Date().toLocaleTimeString(),
    rawHex:`${fc} ${dur} ${addr1} ${addr2} ${addr3} ${seq} ${body} ${fcs}`};
}

function renderHexDump(f){
  const dump=$('hexDump');if(!dump)return;
  dump.innerHTML=
    `<span class="fc-ctrl">${f.fc}</span> `+
    `<span class="fc-dur">${f.dur}</span> `+
    `<span class="fc-addr1">${f.addr1}</span> `+
    `<span class="fc-addr2">${f.addr2}</span> `+
    `<span class="fc-addr3">${f.addr3}</span> `+
    `<span class="fc-seq">${f.seq}</span> `+
    `<span class="fc-body">${f.body}</span> `+
    `<span class="fc-fcs">${f.fcs}</span>`;

  const grid=$('dissectGrid');if(!grid)return;
  grid.innerHTML=`
    <div class="dissect-item"><div class="d-label">Frame Control</div><div class="d-val" style="color:#ef4444">${f.fc}</div></div>
    <div class="dissect-item"><div class="d-label">Type/Subtype</div><div class="d-val">${f.def.label}</div></div>
    <div class="dissect-item"><div class="d-label">Duration</div><div class="d-val" style="color:#f97316">${f.dur}</div></div>
    <div class="dissect-item"><div class="d-label">Addr1 (DA)</div><div class="d-val" style="color:#22c55e">${f.addr1.replace(/ /g,':')}</div></div>
    <div class="dissect-item"><div class="d-label">Addr2 (SA)</div><div class="d-val" style="color:#3b82f6">${f.addr2.replace(/ /g,':')}</div></div>
    <div class="dissect-item"><div class="d-label">Addr3 (BSSID)</div><div class="d-val" style="color:#a855f7">${f.addr3.replace(/ /g,':')}</div></div>
    <div class="dissect-item"><div class="d-label">Seq Control</div><div class="d-val" style="color:#fbbf24">${f.seq}</div></div>
    <div class="dissect-item"><div class="d-label">Body Length</div><div class="d-val">${f.body.split(' ').length} bytes</div></div>
    <div class="dissect-item"><div class="d-label">FCS</div><div class="d-val" style="color:#ec4899">${f.fcs}</div></div>`;
}

function updatePktList(){
  const list=$('pktList');if(!list)return;
  list.innerHTML='';
  frames.slice(-30).reverse().forEach((f,i)=>{
    const e=document.createElement('div');e.className='pkt-entry';e.onclick=()=>renderHexDump(f);
    e.innerHTML=`<span style="color:var(--text-muted);font-family:monospace;font-size:.66rem;min-width:60px">${f.time}</span><span class="pkt-type ${f.def.type}">${f.def.subtype}</span><span style="font-size:.68rem;color:var(--text-muted)">${f.addr2.replace(/ /g,':')} → ${f.addr1.replace(/ /g,':')}</span>`;
    list.appendChild(e);
  });
}

function updateStats(){
  const el=$('frameStats');if(!el)return;
  const total=stats.mgmt+stats.ctrl+stats.data||1;
  el.innerHTML=`<div style="display:flex;gap:10px;flex-wrap:wrap">
    <div style="flex:1;min-width:100px;padding:8px;border-radius:8px;background:rgba(0,0,0,.2);text-align:center"><div style="font-size:1.1rem;font-weight:700;color:var(--accent)">${stats.mgmt}</div><div style="font-size:.7rem;color:var(--text-muted)">Management (${Math.round(stats.mgmt/total*100)}%)</div></div>
    <div style="flex:1;min-width:100px;padding:8px;border-radius:8px;background:rgba(0,0,0,.2);text-align:center"><div style="font-size:1.1rem;font-weight:700;color:#f97316">${stats.ctrl}</div><div style="font-size:.7rem;color:var(--text-muted)">Control (${Math.round(stats.ctrl/total*100)}%)</div></div>
    <div style="flex:1;min-width:100px;padding:8px;border-radius:8px;background:rgba(0,0,0,.2);text-align:center"><div style="font-size:1.1rem;font-weight:700;color:#22c55e">${stats.data}</div><div style="font-size:.7rem;color:var(--text-muted)">Data (${Math.round(stats.data/total*100)}%)</div></div>
  </div>`;
}

function captureFrame(){
  const f=genFrame();frames.push(f);stats[f.def.type]++;
  renderHexDump(f);updatePktList();updateStats();
  log(`${LANG[currentLang].newFrame}: ${f.def.label} ${f.addr2.replace(/ /g,':')} → ${f.addr1.replace(/ /g,':')}`,'rx');
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  frames=[];stats={mgmt:0,ctrl:0,data:0};
  log(LANG[currentLang].simStarted,'success');
  captureFrame();
  simInterval=setInterval(captureFrame,1500);
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

/* ═══════ RICH CANVAS SIMULATION — Packet Byte Stream Visualizer ═══════ */
(function packetStreamCanvas(){
  const CVS_ID='packetStreamVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">🔎</span> Live Byte Stream</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const byteGrid=[];let _raf=null,frameCount=0;
  const FIELD_COLORS={fc:'#ef4444',dur:'#f97316',addr1:'#22c55e',addr2:'#3b82f6',addr3:'#a855f7',seq:'#fbbf24',body:'#06b6d4',fcs:'#ec4899'};
  // Initialize byte grid
  for(let row=0;row<16;row++){
    byteGrid[row]=[];
    for(let col=0;col<32;col++){
      byteGrid[row][col]={value:Math.floor(Math.random()*256).toString(16).padStart(2,'0'),field:'body',age:0,flash:0};
    }
  }
  function updateGrid(){
    // Map frame structure to grid
    const fields=[{name:'fc',len:2},{name:'dur',len:2},{name:'addr1',len:6},{name:'addr2',len:6},{name:'addr3',len:6},{name:'seq',len:2},{name:'body',len:20},{name:'fcs',len:4}];
    let idx=0;
    fields.forEach(f=>{
      for(let b=0;b<f.len;b++){
        const row=Math.floor(idx/32),col=idx%32;
        if(row<16&&col<32){
          byteGrid[row][col].field=f.name;
          if(typeof simRunning!=='undefined'&&simRunning&&Math.random()<0.15){
            byteGrid[row][col].value=Math.floor(Math.random()*256).toString(16).padStart(2,'0');
            byteGrid[row][col].flash=1;
          }
        }
        idx++;
      }
    });
  }
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.2)';ctx.fillRect(0,0,w,h);
    frameCount++;
    if(frameCount%3===0)updateGrid();
    const cellW=w/34,cellH=h/18;
    const offsetX=cellW,offsetY=cellH;
    // Row addresses
    ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.2)';ctx.textAlign='right';
    for(let row=0;row<16;row++){
      ctx.fillText((row*32).toString(16).padStart(4,'0'),offsetX-4,offsetY+row*cellH+cellH*0.7);
    }
    // Draw bytes
    for(let row=0;row<16;row++){
      for(let col=0;col<32;col++){
        const cell=byteGrid[row][col];
        const x=offsetX+col*cellW;const y=offsetY+row*cellH;
        cell.flash=Math.max(0,cell.flash-0.03);
        const color=FIELD_COLORS[cell.field]||'#06b6d4';
        // Background highlight
        if(cell.flash>0){
          ctx.fillStyle=color;ctx.globalAlpha=cell.flash*0.3;
          ctx.fillRect(x,y,cellW-0.5,cellH-0.5);ctx.globalAlpha=1;
        }
        // Hex text
        ctx.font='7px monospace';ctx.textAlign='center';
        ctx.fillStyle=color;ctx.globalAlpha=0.6+cell.flash*0.4;
        ctx.fillText(cell.value,x+cellW/2,y+cellH*0.7);
        ctx.globalAlpha=1;
      }
    }
    // ASCII sidebar
    ctx.font='7px monospace';ctx.textAlign='left';
    for(let row=0;row<16;row++){
      let ascii='';
      for(let col=0;col<32;col++){
        const v=parseInt(byteGrid[row][col].value,16);
        ascii+=(v>=32&&v<=126)?String.fromCharCode(v):'.';
      }
      ctx.fillStyle='rgba(255,255,255,0.12)';
      ctx.fillText(ascii.substring(0,16),offsetX+32*cellW+4,offsetY+row*cellH+cellH*0.7);
    }
    // Field legend bar at bottom
    const legendY=h-12;
    let lx=8;
    Object.entries(FIELD_COLORS).forEach(([name,color])=>{
      ctx.fillStyle=color;
      ctx.fillRect(lx,legendY,8,8);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='7px monospace';ctx.textAlign='left';
      ctx.fillText(name.toUpperCase(),lx+11,legendY+7);
      lx+=name.length*5+20;
    });
    // Scan line effect
    const scanY=(frameCount*2)%Math.floor(h);
    ctx.fillStyle='rgba(34,197,94,0.04)';ctx.fillRect(0,scanY,w,3);
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
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
