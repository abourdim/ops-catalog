/**
 * SE-Phishing-Campaign-Builder — Workshop DIY v1.0
 * Educational phishing simulation for security awareness.
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
const LANG={
en:{title:'Phishing Campaign Builder',subtitle:'Build and analyze phishing simulations',disconnected:'Disconnected',connected:'Connected',mainSection:'Phishing Campaign Builder',mainDesc:'Educational phishing simulation for security awareness',sectionA:'Email Forge',sectionB:'Campaign Stats',sectionC:'Threat Intel',buildBtn:'Build Email',analyzeBtn:'Analyze',clickRate:'Click Rate',clickDesc:'Simulated victim click-through',detectRate:'Detection Rate',detectDesc:'Spam filter detection',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is phishing?',faq_a1:'Fraudulent emails designed to trick recipients into revealing sensitive information.',faq_q2:'Is this real phishing?',faq_a2:'No. This is an educational simulator. No emails are sent.',howto_1:'Select a phishing template.',howto_2:'Click Build Email to generate.',howto_3:'Analyze red flags.',howto_4:'Review campaign statistics.',wiki_t1:'Phishing',wiki_d1:'Social engineering attack using fraudulent communications.',ready:'Phishing Campaign Builder ready.',building:'Building phishing email...',built:'Phishing email generated!',analyzing:'Analyzing email for red flags...',analyzed:'Red flags: spoofed sender, urgency, suspicious link, generic greeting.',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working...',splashHint:'tap to skip',langChanged:'Language \u2192 English',themeChanged:'Theme \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Constructeur de Campagne Phishing',subtitle:'Construire et analyser des simulations de phishing',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Constructeur Phishing',mainDesc:'Simulation \u00e9ducative de phishing',sectionA:'Forge d\'Email',sectionB:'Statistiques',sectionC:'Renseignement',buildBtn:'Construire',analyzeBtn:'Analyser',clickRate:'Taux de Clic',clickDesc:'Clics simul\u00e9s',detectRate:'Taux de D\u00e9tection',detectDesc:'D\u00e9tection anti-spam',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le phishing?',faq_a1:'Emails frauduleux con\u00e7us pour tromper les destinataires.',faq_q2:'Est-ce du vrai phishing?',faq_a2:'Non. C\'est un simulateur \u00e9ducatif.',howto_1:'S\u00e9lectionnez un mod\u00e8le.',howto_2:'Cliquez Construire.',howto_3:'Analysez les signaux d\'alerte.',howto_4:'Consultez les statistiques.',wiki_t1:'Phishing',wiki_d1:'Attaque par ing\u00e9nierie sociale.',ready:'Constructeur Phishing pr\u00eat.',building:'Construction de l\'email...',built:'Email de phishing g\u00e9n\u00e9r\u00e9!',analyzing:'Analyse en cours...',analyzed:'Signaux: exp\u00e9diteur usurp\u00e9, urgence, lien suspect.',logCleared:'Journal effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',working:'En cours...',splashHint:'appuyer pour passer',langChanged:'Langue \u2192 Fran\u00e7ais',themeChanged:'Th\u00e8me \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'\u0628\u0627\u0646\u064a \u062d\u0645\u0644\u0627\u062a \u0627\u0644\u062a\u0635\u064a\u062f',subtitle:'\u0628\u0646\u0627\u0621 \u0648\u062a\u062d\u0644\u064a\u0644 \u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0644\u062a\u0635\u064a\u062f',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0628\u0627\u0646\u064a \u062d\u0645\u0644\u0627\u062a \u0627\u0644\u062a\u0635\u064a\u062f',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u0639\u0644\u064a\u0645\u064a\u0629 \u0644\u0644\u062a\u0635\u064a\u062f',sectionA:'\u0645\u0635\u0646\u0639 \u0627\u0644\u0628\u0631\u064a\u062f',sectionB:'\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a',sectionC:'\u0627\u0633\u062a\u062e\u0628\u0627\u0631\u0627\u062a',buildBtn:'\u0628\u0646\u0627\u0621',analyzeBtn:'\u062a\u062d\u0644\u064a\u0644',clickRate:'\u0645\u0639\u062f\u0644 \u0627\u0644\u0646\u0642\u0631',clickDesc:'\u0646\u0642\u0631\u0627\u062a \u0645\u062d\u0627\u0643\u0627\u0629',detectRate:'\u0645\u0639\u062f\u0644 \u0627\u0644\u0643\u0634\u0641',detectDesc:'\u0643\u0634\u0641 \u0645\u0636\u0627\u062f \u0627\u0644\u0628\u0631\u064a\u062f',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',faq_q1:'\u0645\u0627 \u0647\u0648 \u0627\u0644\u062a\u0635\u064a\u062f\u061f',faq_a1:'\u0631\u0633\u0627\u0626\u0644 \u0627\u062d\u062a\u064a\u0627\u0644\u064a\u0629 \u0644\u062e\u062f\u0627\u0639 \u0627\u0644\u0645\u0633\u062a\u0644\u0645\u064a\u0646.',faq_q2:'\u0647\u0644 \u0647\u0630\u0627 \u062a\u0635\u064a\u062f \u062d\u0642\u064a\u0642\u064a\u061f',faq_a2:'\u0644\u0627. \u0645\u062d\u0627\u0643\u064a \u062a\u0639\u0644\u064a\u0645\u064a.',howto_1:'\u0627\u062e\u062a\u0631 \u0642\u0627\u0644\u0628\u0627\u064b.',howto_2:'\u0627\u0646\u0642\u0631 \u0628\u0646\u0627\u0621.',howto_3:'\u062d\u0644\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a.',howto_4:'\u0631\u0627\u062c\u0639 \u0627\u0644\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a.',wiki_t1:'\u0627\u0644\u062a\u0635\u064a\u062f',wiki_d1:'\u0647\u062c\u0648\u0645 \u0647\u0646\u062f\u0633\u0629 \u0627\u062c\u062a\u0645\u0627\u0639\u064a\u0629.',ready:'\u0628\u0627\u0646\u064a \u0627\u0644\u062a\u0635\u064a\u062f \u062c\u0627\u0647\u0632.',building:'\u062c\u0627\u0631\u064d \u0628\u0646\u0627\u0621 \u0627\u0644\u0628\u0631\u064a\u062f...',built:'\u062a\u0645 \u062a\u0648\u0644\u064a\u062f \u0628\u0631\u064a\u062f \u0627\u0644\u062a\u0635\u064a\u062f!',analyzing:'\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0644\u064a\u0644...',analyzed:'\u0625\u0634\u0627\u0631\u0627\u062a: \u0645\u0631\u0633\u0644 \u0645\u0632\u064a\u0641\u060c \u0627\u0633\u062a\u0639\u062c\u0627\u0644\u060c \u0631\u0627\u0628\u0637 \u0645\u0634\u0628\u0648\u0647.',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',working:'\u062c\u0627\u0631\u064d...',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}
};
let currentLang='en';function T(k){return(LANG[currentLang]||LANG.en)[k]||k;}

/* ═══════ FRAMEWORK ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else{o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' \u2014 Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(T('themeChanged')+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(T('logCleared'));}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(T('copied'),'success');}catch{log(T('copyFail'),'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||T('working');el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText');if(t)t.textContent=c?T('connected'):T('disconnected');const p=$('statusPill');if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open');}function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const s=$('logPanel');s&&s.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const el=$(id);if(el)el.classList.add('active');});});}

/* ═══════ PHISHING TEMPLATES ═══════ */
const TEMPLATES={
  password:{from:'security@micr0soft-support.com',subject:'Urgent: Password Reset Required',body:'Dear User,\n\nWe detected suspicious activity on your account. Click the link below to reset your password immediately:\n\nhttps://micr0soft-support.com/reset?id=x7k2m\n\nIf you do not reset within 24 hours, your account will be suspended.\n\nMicrosoft Support Team'},
  invoice:{from:'billing@amaz0n-orders.net',subject:'Invoice #INV-2847 - Payment Due',body:'Dear Customer,\n\nYour invoice of $499.99 is past due. Please review and pay immediately:\n\nhttps://amaz0n-orders.net/pay/inv-2847\n\nFailure to pay will result in account suspension.\n\nAmazon Billing'},
  prize:{from:'rewards@g00gle-prizes.org',subject:'Congratulations! You Won $10,000!',body:'Dear Winner!\n\nYou have been selected as our monthly prize winner! Claim your $10,000 reward:\n\nhttps://g00gle-prizes.org/claim/winner\n\nProvide your banking details to receive the transfer.\n\nGoogle Rewards Team'},
  urgent:{from:'ceo@company-internal.biz',subject:'URGENT: Wire Transfer Needed Today',body:'Hi,\n\nI need you to process an emergency wire transfer of $25,000. This is confidential.\n\nAccount: 4829-7716-3340\nBank: Overseas National Bank\n\nDo this NOW. I will explain later.\n\n- CEO'}
};

function buildEmail(){
  const key=$('templateSelect')?$('templateSelect').value:'password';
  const tmpl=TEMPLATES[key];
  log(T('building'),'info');showToast(T('building'));
  setTimeout(()=>{
    hideToast();
    const preview=$('emailPreview');
    if(preview){
      preview.style.display='block';
      preview.innerHTML='<div class="email-header">From: '+tmpl.from+'</div><div class="email-header">Subject: '+tmpl.subject+'</div><hr style="border-color:var(--border,#333);margin:8px 0"><pre style="white-space:pre-wrap;font-family:inherit;margin:0">'+tmpl.body+'</pre>';
    }
    const clickRate=Math.round(Math.random()*30+15);
    const detectRate=Math.round(Math.random()*40+30);
    $('clickVal').textContent=clickRate+'%';
    $('detectVal').textContent=detectRate+'%';
    log(T('built'),'success');
    setStatus(true);
    const tl=$('threatLog');if(tl)tl.textContent+='\\n[BUILD] Template: '+key+'\\n[BUILD] Spoofed sender: '+tmpl.from+'\\n[STATS] Click rate: '+clickRate+'% | Detection: '+detectRate+'%';
  },1200);
}

function analyzeEmail(){
  log(T('analyzing'),'info');showToast(T('analyzing'));
  setTimeout(()=>{hideToast();log(T('analyzed'),'success');const tl=$('threatLog');if(tl)tl.textContent+='\\n[ANALYSIS] Spoofed domain (0 vs O substitution)\\n[ANALYSIS] Urgency language detected\\n[ANALYSIS] Suspicious URL pattern\\n[ANALYSIS] Generic greeting (no personal name)\\n[VERDICT] HIGH RISK - Phishing attempt';},1500);
}

/* ═══════ CANVAS SIM ═══════ */
function initSimCanvas(){
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d');c.width=c.offsetWidth||800;c.height=220;
  const emails=[];let t=0;
  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,c.width,c.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    if(Math.random()<0.05)emails.push({x:0,y:30+Math.random()*(c.height-60),speed:1+Math.random()*3,size:4+Math.random()*4,caught:false});
    // Firewall line
    ctx.strokeStyle='#4f4';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(c.width*0.7,0);ctx.lineTo(c.width*0.7,c.height);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#4f4';ctx.font='10px Orbitron,monospace';ctx.fillText('FIREWALL',c.width*0.7-25,15);
    for(let i=emails.length-1;i>=0;i--){
      const e=emails[i];e.x+=e.speed;
      if(e.x>c.width*0.7&&!e.caught&&Math.random()<0.02){e.caught=true;e.speed=0;}
      ctx.beginPath();
      if(e.caught){ctx.fillStyle='#f44';ctx.arc(e.x,e.y,e.size,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f44';ctx.font='8px monospace';ctx.fillText('BLOCKED',e.x+8,e.y+3);}
      else{ctx.fillStyle=accent;ctx.arc(e.x,e.y,e.size,0,Math.PI*2);ctx.fill();}
      if(e.x>c.width+20||e.caught&&t%300===0)emails.splice(i,1);
    }
    ctx.fillStyle='#fff';ctx.font='10px Orbitron,monospace';ctx.fillText('PHISHING EMAILS \u2192',10,15);
    ctx.fillText('INBOX \u2192',c.width*0.75,15);
    t++;requestAnimationFrame(draw);
  }
  draw();
}

function initStatsCanvas(){
  const c=$('statsCanvas');if(!c)return;const ctx=c.getContext('2d');c.width=c.offsetWidth||800;c.height=200;
  let t=0;const data=Array(50).fill(0);
  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    data.push(Math.random()*100);if(data.length>50)data.shift();
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
    data.forEach((v,i)=>{const x=i*(c.width/50),y=c.height-v*1.8;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='10px Orbitron,monospace';ctx.fillText('CAMPAIGN METRICS (LIVE)',10,15);
    t++;requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const ls=$('langSelect'),ts=$('themeSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  initHijriDate();initSimCanvas();initStatsCanvas();
  if($('buildBtn'))$('buildBtn').onclick=buildEmail;
  if($('analyzeBtn'))$('analyzeBtn').onclick=analyzeEmail;
  log(T('ready'),'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
