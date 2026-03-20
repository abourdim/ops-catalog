/**
 * Workshop DIY — Electronic Warfare Sim v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){
  if(!soundEnabled) return;
  if(!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value=0.08;
  const t = audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}
}

/* ═══════ i18n ═══════ */
const LANG = {
  en:{title:'Electronic Warfare Sim',subtitle:'Electronic Warfare Simulator',disconnected:'Idle',connected:'Jamming',mainSection:'Electronic Warfare Simulator',mainDesc:'Simulate jamming, ECM/ECCM and spectrum dominance',sectionA:'Active Emitters',sectionB:'EW Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Set jamming frequency and bandwidth.',howto_2:'Choose jamming type and power.',howto_3:'Click Start Jamming.',howto_4:'Deploy ECM/ECCM countermeasures.',working:'Working...',ready:'EW Sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startJam:'Start Jamming',stopJam:'Stop Jamming',deployECM:'Deploy ECM',activateECCM:'Activate ECCM',resetSim:'Reset',jamParams:'Jamming Parameters',ewParams:'EW Parameters',centerFreq:'Center Freq (MHz):',bandwidth:'Bandwidth (MHz):',jamPower:'Jam Power (dBm):',jamType:'Jam Type:',ewStatus:'EW Status',emitterHint:'Detected RF emitters and their status.',barrage:'Barrage',spot:'Spot',sweep:'Sweep',pulse:'Pulse',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF warfare! 🔬 You get to experiment with electronic warfare signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real electronic warfare signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real electromagnetic combat techniques! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Rfw Radar Jammer Lab and Rfw Frequency Deconfliction! Each teaches something different. 🚀'},
  fr:{title:'Sim Guerre Electronique',subtitle:'Simulateur de Guerre Electronique',disconnected:'Inactif',connected:'Brouillage',mainSection:'Simulateur Guerre Electronique',mainDesc:'Simuler le brouillage, ECM/ECCM et dominance spectrale',sectionA:'Emetteurs Actifs',sectionB:'Techniques GE',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Definir frequence et bande passante.',howto_2:'Choisir type et puissance.',howto_3:'Cliquer Demarrer.',howto_4:'Deployer ECM/ECCM.',working:'En cours...',ready:'Sim GE pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startJam:'Demarrer Brouillage',stopJam:'Arreter Brouillage',deployECM:'Deployer ECM',activateECCM:'Activer ECCM',resetSim:'Reinitialiser',jamParams:'Parametres Brouillage',ewParams:'Parametres GE',centerFreq:'Freq Centre (MHz):',bandwidth:'Bande Passante (MHz):',jamPower:'Puissance (dBm):',jamType:'Type Brouillage:',ewStatus:'Statut GE',emitterHint:'Emetteurs RF detectes et leur statut.',barrage:'Barrage',spot:'Ponctuel',sweep:'Balayage',pulse:'Impulsion',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Radar Jammer Lab and Rfw Frequency Deconfliction ! Chacune enseigne quelque chose de différent. 🚀'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',subtitle:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0634\u0648\u064a\u0634',mainSection:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0644\u062a\u0634\u0648\u064a\u0634 \u0648\u0627\u0644\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0627\u0644\u0645\u0636\u0627\u062f\u0629',sectionA:'\u0627\u0644\u0628\u0627\u0639\u062b\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startJam:'\u0628\u062f\u0621 \u0627\u0644\u062a\u0634\u0648\u064a\u0634',stopJam:'\u0625\u064a\u0642\u0627\u0641 \u0627\u0644\u062a\u0634\u0648\u064a\u0634',deployECM:'\u0646\u0634\u0631 ECM',activateECCM:'\u062a\u0641\u0639\u064a\u0644 ECCM',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',jamParams:'\u0645\u0639\u0644\u0645\u0627\u062a \u0627\u0644\u062a\u0634\u0648\u064a\u0634',ewParams:'\u0645\u0639\u0644\u0645\u0627\u062a \u0627\u0644\u062d\u0631\u0628',centerFreq:'\u0627\u0644\u062a\u0631\u062f\u062f \u0627\u0644\u0645\u0631\u0643\u0632\u064a:',bandwidth:'\u0639\u0631\u0636 \u0627\u0644\u0646\u0637\u0627\u0642:',jamPower:'\u0642\u062f\u0631\u0629 \u0627\u0644\u062a\u0634\u0648\u064a\u0634:',jamType:'\u0646\u0648\u0639 \u0627\u0644\u062a\u0634\u0648\u064a\u0634:',ewStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u062d\u0631\u0628',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Radar Jammer Lab and Rfw Frequency Deconfliction! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

/* ═══════ THEMES ═══════ */
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ew-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}

/* ═══════ TOAST ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}

/* ═══════ STATUS ═══════ */
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ PANELS ═══════ */
function initPanels(){
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');
  const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');
  if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};
  if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};
  if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};
  if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};
  if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};
  if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};
  if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};
  if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');
  const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');
  if(langSel)langSel.onchange=()=>setLanguage(langSel.value);
  if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);
  if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};
  const clearBtn=$('clearLogBtn'),copyBtn=$('copyLogBtn'),expBtn=$('exportLogBtn');
  if(clearBtn)clearBtn.onclick=clearLog;
  if(copyBtn)copyBtn.onclick=copyLog;
  if(expBtn)expBtn.onclick=exportLog;
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});
}

/* ═══════ EW DATA ═══════ */
let emitters = [];
let jamming = false;
let ecmActive = false;
let eccmActive = false;
let animFrame = null;
let time = 0;
let sweepPhase = 0;
let waterfallData = [];

function initEmitters(){
  emitters = [];
  const bands = [{name:'WiFi 2.4G',freq:2400,bw:80},{name:'WiFi 5G',freq:5200,bw:160},{name:'Radar X',freq:9500,bw:200},{name:'UHF Comms',freq:450,bw:25},{name:'L-Band SAT',freq:1575,bw:20},{name:'S-Band Radar',freq:3000,bw:100},{name:'C-Band VSAT',freq:4200,bw:40},{name:'VHF Radio',freq:150,bw:15}];
  bands.forEach((b,i)=>{
    emitters.push({id:'EM-'+(i+1),name:b.name,freq:b.freq,bw:b.bw,power:-30+Math.random()*40,active:true,jammed:false});
  });
}

/* ═══════ SPECTRUM CANVAS ═══════ */
function drawSpectrum(){
  const c=$('spectrumCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width, H=c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Grid
  for(let i=0;i<=10;i++){
    const x=i*W/10;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText((100+i*590).toFixed(0),x,H-5);
  }
  for(let i=0;i<=5;i++){
    const y=i*H/5;
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();
    ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText((-20-i*20).toFixed(0)+' dBm',2,y+12);
  }

  // Noise floor
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const nf = H*0.75 + Math.random()*10 - 5;
    if(x===0)ctx.moveTo(x,nf);else ctx.lineTo(x,nf);
  }
  ctx.strokeStyle='rgba(0,200,255,0.3)';ctx.lineWidth=1;ctx.stroke();

  // Emitter signals
  const centerFreq=parseFloat($('freqInput')?.value||2400);
  const bw=parseFloat($('bwInput')?.value||50);
  const jamPwr=parseFloat($('powerInput')?.value||20);
  const jamType=$('jamTypeSelect')?.value||'barrage';

  emitters.forEach(em=>{
    if(!em.active)return;
    const fx=(em.freq-100)/(6000-100)*W;
    const sigW=em.bw/(6000-100)*W;
    const sigH=(em.power+100)/120*H*0.7;
    ctx.beginPath();
    ctx.moveTo(fx-sigW,H*0.75);
    ctx.quadraticCurveTo(fx,H*0.75-sigH,fx+sigW,H*0.75);
    ctx.strokeStyle=em.jammed?'rgba(255,50,50,0.6)':'rgba(0,200,255,0.7)';
    ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle=em.jammed?'rgba(255,50,50,0.15)':'rgba(0,200,255,0.1)';
    ctx.fill();
    ctx.fillStyle=em.jammed?'#ff6666':'#66ccff';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(em.name,fx,H*0.75-sigH-8);
  });

  // Jamming visualization
  if(jamming){
    const jx=(centerFreq-100)/(6000-100)*W;
    let jw;
    if(jamType==='barrage') jw=bw*3/(6000-100)*W;
    else if(jamType==='spot') jw=bw*0.5/(6000-100)*W;
    else if(jamType==='sweep'){sweepPhase+=0.02;jw=bw/(6000-100)*W;const offset=Math.sin(sweepPhase)*bw*2/(6000-100)*W;}
    else jw=bw/(6000-100)*W;

    const actualX=jamType==='sweep'?jx+Math.sin(sweepPhase)*bw*2/(6000-100)*W:jx;
    const jamH=(jamPwr+20)/60*H*0.7;

    // Pulse modulation
    const pulseOn=jamType==='pulse'?Math.sin(time*10)>0:true;
    if(pulseOn){
      ctx.beginPath();
      ctx.moveTo(actualX-jw,H*0.75);
      ctx.quadraticCurveTo(actualX,H*0.75-jamH,actualX+jw,H*0.75);
      ctx.fillStyle='rgba(255,50,50,0.25)';ctx.fill();
      ctx.strokeStyle='rgba(255,50,50,0.9)';ctx.lineWidth=2;ctx.stroke();

      // Jam noise
      ctx.beginPath();
      for(let x=actualX-jw;x<actualX+jw;x+=2){
        const ny=H*0.75-jamH*0.5+Math.random()*jamH*0.4;
        if(x===actualX-jw)ctx.moveTo(x,ny);else ctx.lineTo(x,ny);
      }
      ctx.strokeStyle='rgba(255,100,100,0.5)';ctx.lineWidth=1;ctx.stroke();
    }

    // Check which emitters are jammed
    emitters.forEach(em=>{
      em.jammed=jamming&&Math.abs(em.freq-centerFreq)<bw*1.5&&em.power<jamPwr;
      if(eccmActive&&em.jammed)em.jammed=Math.random()>0.5;
    });
  } else {
    emitters.forEach(em=>em.jammed=false);
  }

  // ECM decoy signals
  if(ecmActive){
    for(let i=0;i<5;i++){
      const dx=Math.random()*W;
      const dy=H*0.4+Math.random()*H*0.3;
      ctx.beginPath();ctx.arc(dx,dy,3+Math.random()*4,0,Math.PI*2);
      ctx.fillStyle='rgba(255,200,0,0.6)';ctx.fill();
    }
    ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='right';
    ctx.fillText('ECM DECOYS ACTIVE',W-10,20);
  }

  // Labels
  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RF SPECTRUM ANALYZER',10,18);
  if(jamming){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('JAMMING: '+jamType.toUpperCase()+' @ '+centerFreq+' MHz',10,34);}
  if(eccmActive){ctx.fillStyle='rgba(0,255,200,0.7)';ctx.fillText('ECCM ACTIVE',10,50);}
}

/* ═══════ WATERFALL CANVAS ═══════ */
function drawWaterfall(){
  const c=$('waterfallCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;

  // Shift existing data down
  const imgData=ctx.getImageData(0,0,W,H-1);
  ctx.putImageData(imgData,0,1);

  // Draw new line at top
  const centerFreq=parseFloat($('freqInput')?.value||2400);
  const bw=parseFloat($('bwInput')?.value||50);
  const jamPwr=parseFloat($('powerInput')?.value||20);

  for(let x=0;x<W;x++){
    const freq=100+(x/W)*5900;
    let intensity=Math.random()*30;
    // Emitter contributions
    emitters.forEach(em=>{
      if(!em.active)return;
      const dist=Math.abs(freq-em.freq);
      if(dist<em.bw) intensity+=((em.power+60)/100)*80*(1-dist/em.bw);
    });
    // Jamming contribution
    if(jamming){
      const dist=Math.abs(freq-centerFreq);
      if(dist<bw*1.5) intensity+=((jamPwr+20)/60)*120*(1-dist/(bw*1.5));
    }
    intensity=Math.min(255,intensity);
    const r=intensity>128?255:intensity*2;
    const g=intensity>128?(255-intensity)*2:intensity;
    const b=intensity<64?intensity*4:0;
    ctx.fillStyle='rgb('+r+','+g+','+b+')';
    ctx.fillRect(x,0,1,1);
  }

  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('WATERFALL DISPLAY',5,H-5);
}

/* ═══════ ANIMATION LOOP ═══════ */
function animate(){
  time+=0.016;
  drawSpectrum();
  drawWaterfall();
  updateStats();
  animFrame=requestAnimationFrame(animate);
}

function updateStats(){
  const stats=$('ewStats');if(!stats)return;
  const freq=parseFloat($('freqInput')?.value||2400);
  const bw=parseFloat($('bwInput')?.value||50);
  const pwr=parseFloat($('powerInput')?.value||20);
  const jammedCount=emitters.filter(e=>e.jammed).length;
  stats.innerHTML=
    '<b>Freq:</b> '+freq+' MHz <b>BW:</b> '+bw+' MHz<br>'+
    '<b>Power:</b> '+pwr+' dBm<br>'+
    '<b>Emitters:</b> '+emitters.length+' ('+jammedCount+' jammed)<br>'+
    '<b>ECM:</b> '+(ecmActive?'<span style="color:#ffcc00">ACTIVE</span>':'OFF')+
    ' <b>ECCM:</b> '+(eccmActive?'<span style="color:#00cc88">ACTIVE</span>':'OFF')+'<br>'+
    '<b>Status:</b> '+(jamming?'<span style="color:#ff4444">JAMMING</span>':'<span style="color:#00cc88">STANDBY</span>');
}

/* ═══════ EMITTER LIST ═══════ */
function updateEmitterList(){
  const lib=$('emitterList');if(!lib)return;
  lib.innerHTML='';
  emitters.forEach(em=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(em.jammed?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');
    row.innerHTML='<span style="color:'+(em.jammed?'#ff6666':'#66ccff')+'">'+em.id+' '+em.name+'</span>'+
      '<span>'+em.freq+' MHz</span>'+
      '<span>'+em.power.toFixed(0)+' dBm</span>'+
      '<span style="color:'+(em.jammed?'#ff4444':'#00cc88')+'">'+(em.jammed?'JAMMED':'ACTIVE')+'</span>';
    lib.appendChild(row);
  });
}

/* ═══════ TECHNIQUES DATABASE ═══════ */
function initTechDatabase(){
  const db=$('techDatabase');if(!db)return;
  db.innerHTML=[
    '<b>Barrage Jamming:</b> Wideband noise across entire frequency range.',
    '<b>Spot Jamming:</b> Concentrated energy on specific frequency.',
    '<b>Sweep Jamming:</b> Rapidly sweeping across a band.',
    '<b>Pulse Jamming:</b> High-power intermittent bursts.',
    '<b>ECM (Electronic Countermeasures):</b> Decoys and false targets.',
    '<b>ECCM (Electronic Counter-Countermeasures):</b> Frequency hopping, spread spectrum.',
  ].join('<br><br>');
}

/* ═══════ CONTROLS ═══════ */
function initControls(){
  $('freqInput').oninput=()=>{$('freqLabel').textContent=$('freqInput').value+' MHz';};
  $('bwInput').oninput=()=>{$('bwLabel').textContent=$('bwInput').value+' MHz';};
  $('powerInput').oninput=()=>{$('powerLabel').textContent=$('powerInput').value+' dBm';};

  $('jamBtn').onclick=()=>{
    jamming=!jamming;
    setStatus(jamming);
    $('jamBtn').querySelector('[data-i18n]').textContent=jamming?LANG[currentLang].stopJam:LANG[currentLang].startJam;
    log(jamming?'Jamming STARTED — '+$('jamTypeSelect').value+' @ '+$('freqInput').value+' MHz':'Jamming STOPPED',jamming?'tx':'info');
    if(jamming)showToast('Jamming active...',2000);
  };

  $('ecmBtn').onclick=()=>{
    ecmActive=!ecmActive;
    log(ecmActive?'ECM deployed — generating decoy signals':'ECM deactivated',ecmActive?'tx':'info');
    playSound(ecmActive?'success':'click');
  };

  $('eccmBtn').onclick=()=>{
    eccmActive=!eccmActive;
    log(eccmActive?'ECCM activated — frequency hopping enabled':'ECCM deactivated',eccmActive?'success':'info');
    playSound(eccmActive?'success':'click');
  };

  $('resetBtn').onclick=()=>{
    jamming=false;ecmActive=false;eccmActive=false;
    setStatus(false);
    initEmitters();
    $('jamBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startJam;
    log('Simulation reset','info');
    playSound('click');
  };
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  initSplash();
  initPanels();
  initLogFilters();
  initEmitters();
  initTechDatabase();
  initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');
  animate();
  setInterval(updateEmitterList,1000);
});

/* ═══════ ENHANCED RF CANVAS — ELECTRONIC WARFARE ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _threatBearing=new Array(360).fill(-90);
let _jamEfficiency=new Array(200).fill(0);
let _freqHopLog=[];let _ewParticles=[];

class EWParticle{constructor(x,y,vx,vy,c){this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.c=c;this.life=1;this.decay=0.02+Math.random()*0.02;}
update(){this.x+=this.vx;this.y+=this.vy;this.life-=this.decay;return this.life>0;}
draw(ctx){ctx.beginPath();ctx.arc(this.x,this.y,2*this.life,0,Math.PI*2);ctx.fillStyle=this.c.replace('1)',this.life*0.6+')');ctx.fill();}}

/* ── Threat Bearing Display (RWR) ── */
function drawRWR(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RADAR WARNING RECEIVER',5,12);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-25;
  for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/3,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText('N',cx,cy-R-5);ctx.fillText('S',cx,cy+R+10);ctx.fillText('E',cx+R+8,cy+3);ctx.fillText('W',cx-R-8,cy+3);
  if(typeof emitters!=='undefined'){
    emitters.forEach((em,i)=>{
      const bearing=(i*45+_t*10)%360;const br=bearing*Math.PI/180;
      const threat=(em.power+60)/100;const dist=0.3+threat*0.5;
      const ex=cx+Math.cos(br-Math.PI/2)*dist*R;const ey=cy+Math.sin(br-Math.PI/2)*dist*R;
      const symbol=em.name.includes('Radar')?'▲':em.name.includes('Comms')?'◆':'●';
      ctx.fillStyle=em.jammed?'rgba(100,100,100,0.5)':threat>0.6?'rgba(255,50,50,0.8)':threat>0.3?'rgba(255,200,0,0.7)':'rgba(0,200,255,0.6)';
      ctx.font='12px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(symbol,ex,ey+4);
      ctx.font='7px Orbitron,monospace';ctx.fillText(em.id,ex,ey-8);
      if(!em.jammed&&threat>0.5){ctx.beginPath();ctx.arc(ex,ey,8+Math.sin(_t*4+i)*3,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=1;ctx.stroke();}
    });
  }
  ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fillStyle='rgba(0,255,136,0.8)';ctx.fill();
}

/* ── Jamming Efficiency Chart ── */
function drawJamEfficiency(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('JAMMING EFFICIENCY OVER TIME',5,12);
  const isJam=typeof jamming!=='undefined'&&jamming;
  const pwr=parseFloat(_$('powerInput')?.value||20);
  const eff=isJam?Math.min(99,pwr*2+Math.random()*15):Math.random()*5;
  _jamEfficiency.push(eff);if(_jamEfficiency.length>200)_jamEfficiency.shift();
  ctx.beginPath();
  _jamEfficiency.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isJam?'rgba(255,100,0,0.7)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
  ctx.lineTo(W,H-10);ctx.lineTo(0,H-10);ctx.closePath();
  ctx.fillStyle=isJam?'rgba(255,100,0,0.08)':'rgba(0,200,255,0.04)';ctx.fill();
  const lastEff=_jamEfficiency[_jamEfficiency.length-1];
  ctx.fillStyle=lastEff>60?'rgba(0,200,100,0.7)':'rgba(255,200,0,0.7)';ctx.font='14px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(lastEff.toFixed(0)+'%',W-10,30);
}

/* ── ECCM Frequency Hopping Visualization ── */
function drawECCMHopping(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ECCM FREQUENCY HOPPING',5,12);
  const isECCM=typeof eccmActive!=='undefined'&&eccmActive;
  if(isECCM&&_t%0.08<0.02){
    _freqHopLog.push({f:100+Math.random()*5800,t:_t});
    if(_freqHopLog.length>120)_freqHopLog.shift();
  }
  _freqHopLog.forEach((h,i)=>{
    const x=(i/120)*W;const y=20+((h.f-100)/5800)*(H-30);
    ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);
    const alpha=1-i/120;
    ctx.fillStyle='rgba(0,255,200,'+alpha*0.7+')';ctx.fill();
    if(i>0){const prev=_freqHopLog[i-1];ctx.beginPath();
      ctx.moveTo(((i-1)/120)*W,20+((prev.f-100)/5800)*(H-30));ctx.lineTo(x,y);
      ctx.strokeStyle='rgba(0,255,200,'+alpha*0.2+')';ctx.lineWidth=0.5;ctx.stroke();}
  });
  if(!isECCM){ctx.fillStyle='rgba(100,100,100,0.4)';ctx.font='11px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('ECCM INACTIVE',W/2,H/2);}
}

/* ── Power Spectral Density 3D View ── */
function drawPSD3D(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('POWER SPECTRAL DENSITY',5,12);
  const isJam=typeof jamming!=='undefined'&&jamming;
  const rows=20;
  for(let r=rows-1;r>=0;r--){
    ctx.beginPath();
    const yOffset=20+r*(H-30)/rows;
    for(let x=0;x<W;x++){
      const f=(x/W)*6000;let psd=-80+Math.random()*3;
      if(typeof emitters!=='undefined')emitters.forEach(em=>{if(Math.abs(f-em.freq)<em.bw)psd+=20;});
      if(isJam){const cf=parseFloat(_$('freqInput')?.value||2400);const bw=parseFloat(_$('bwInput')?.value||50);if(Math.abs(f-cf)<bw*1.5)psd+=15;}
      const h=(psd+85)/50*15;
      const y=yOffset-h+Math.sin(_t+r*0.3)*0.5;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    const alpha=0.1+((rows-r)/rows)*0.4;
    ctx.strokeStyle=isJam?'rgba(255,100,0,'+alpha+')':'rgba(0,200,255,'+alpha+')';ctx.lineWidth=1;ctx.stroke();
  }
}

function enhancedRender(){
  _t+=0.016;
  for(let i=_ewParticles.length-1;i>=0;i--)if(!_ewParticles[i].update())_ewParticles.splice(i,1);
  const specC=_$('spectrumCanvas');
  if(specC){const ctx=specC.getContext('2d');
    drawRWR(ctx,specC.width,specC.height);
    if(typeof jamming!=='undefined'&&jamming){
      for(let i=0;i<2;i++){const a=Math.random()*Math.PI*2;
        _ewParticles.push(new EWParticle(specC.width/2,specC.height/2,Math.cos(a)*2,Math.sin(a)*2,'rgba(255,100,0,1)'));}
      _ewParticles.forEach(p=>p.draw(ctx));
    }
  }
  const wfC=_$('waterfallCanvas');
  if(wfC){const ctx=wfC.getContext('2d');
    drawJamEfficiency(ctx,wfC.width,wfC.height);}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
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
