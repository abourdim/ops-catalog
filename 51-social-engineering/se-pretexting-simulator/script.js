/**
 * SE-Pretexting-Simulator — Workshop DIY v1.0
 * Simulates social engineering pretext scenarios for training.
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';

const LANG = {
  en: {
    title:'Pretexting Simulator', subtitle:'Craft and analyze social engineering pretexts',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Pretexting Simulator', mainDesc:'Learn to recognize social engineering pretexts',
    sectionA:'Scenario Builder', sectionB:'Conversation', sectionC:'Analysis Report',
    startBtn:'Start Scenario', analyzeBtn:'Analyze', sendBtn:'Send',
    trustLabel:'Trust Level', trustDesc:'Victim trust score',
    riskLabel:'Risk Level', riskDesc:'Information exposure risk',
    responsePlaceholder:'Type victim response...',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', filterAll:'All',
    settings:'Settings', language:'Language', theme:'Theme', soundEffects:'Sound effects',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    faq_q1:'What is pretexting?', faq_a1:'Creating a fabricated scenario to manipulate a victim into providing information.',
    faq_q2:'Is this a real attack?', faq_a2:'No. This is a training simulation.',
    howto_1:'Select a scenario and click Start.', howto_2:'Watch the conversation unfold.',
    howto_3:'Respond as the victim to test awareness.', howto_4:'Analyze the pretext for red flags.',
    wiki_t1:'Pretexting', wiki_d1:'A form of social engineering where attackers create scenarios to gain trust.',
    ready:'Pretexting Simulator ready.',
    scenarioStarted:'Scenario started: ', analyzing:'Analyzing pretext...',
    redFlags:'Red flags detected: urgency, authority impersonation, information request.',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    working:'Working...', splashHint:'tap to skip',
    langChanged:'Language \u2192 English', themeChanged:'Theme \u2192',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  },
  fr: {
    title:'Simulateur de Pr\u00e9texte', subtitle:'Cr\u00e9er et analyser des pr\u00e9textes d\'ing\u00e9nierie sociale',
    disconnected:'D\u00e9connect\u00e9', connected:'Connect\u00e9',
    mainSection:'Simulateur de Pr\u00e9texte', mainDesc:'Apprendre \u00e0 reconna\u00eetre les pr\u00e9textes',
    sectionA:'Constructeur de Sc\u00e9nario', sectionB:'Conversation', sectionC:'Rapport d\'Analyse',
    startBtn:'D\u00e9marrer', analyzeBtn:'Analyser', sendBtn:'Envoyer',
    trustLabel:'Niveau de Confiance', trustDesc:'Score de confiance de la victime',
    riskLabel:'Niveau de Risque', riskDesc:'Risque d\'exposition',
    responsePlaceholder:'Tapez la r\u00e9ponse...',
    activityLog:'Journal', eventsMsg:'\u00c9v\u00e9nements',
    clear:'Effacer', copy:'Copier', export:'Exporter', filterAll:'Tout',
    settings:'Param\u00e8tres', language:'Langue', theme:'Th\u00e8me', soundEffects:'Effets sonores',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    faq_q1:'Qu\'est-ce que le pretexting?', faq_a1:'Cr\u00e9er un sc\u00e9nario fabriqu\u00e9 pour manipuler la victime.',
    faq_q2:'Est-ce une vraie attaque?', faq_a2:'Non. C\'est une simulation de formation.',
    howto_1:'S\u00e9lectionnez un sc\u00e9nario.', howto_2:'Observez la conversation.',
    howto_3:'R\u00e9pondez en tant que victime.', howto_4:'Analysez les signaux d\'alerte.',
    wiki_t1:'Pretexting', wiki_d1:'Forme d\'ing\u00e9nierie sociale o\u00f9 l\'attaquant cr\u00e9e des sc\u00e9narios.',
    ready:'Simulateur de Pr\u00e9texte pr\u00eat.',
    scenarioStarted:'Sc\u00e9nario d\u00e9marr\u00e9: ', analyzing:'Analyse du pr\u00e9texte...',
    redFlags:'Signaux d\'alerte: urgence, usurpation d\'autorit\u00e9, demande d\'information.',
    logCleared:'Journal effac\u00e9', copied:'Copi\u00e9!', copyFail:'\u00c9chec',
    working:'En cours...', splashHint:'appuyer pour passer',
    langChanged:'Langue \u2192 Fran\u00e7ais', themeChanged:'Th\u00e8me \u2192',
    t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  },
  ar: {
    title:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u0630\u0631\u064a\u0639\u0629', subtitle:'\u0628\u0646\u0627\u0621 \u0648\u062a\u062d\u0644\u064a\u0644 \u0630\u0631\u0627\u0626\u0639 \u0627\u0644\u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a\u0629',
    disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644', connected:'\u0645\u062a\u0635\u0644',
    mainSection:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u0630\u0631\u064a\u0639\u0629', mainDesc:'\u062a\u0639\u0644\u0645 \u0627\u0644\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0630\u0631\u0627\u0626\u0639',
    sectionA:'\u0628\u0627\u0646\u064a \u0627\u0644\u0633\u064a\u0646\u0627\u0631\u064a\u0648', sectionB:'\u0627\u0644\u0645\u062d\u0627\u062f\u062b\u0629', sectionC:'\u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u062a\u062d\u0644\u064a\u0644',
    startBtn:'\u0628\u062f\u0621', analyzeBtn:'\u062a\u062d\u0644\u064a\u0644', sendBtn:'\u0625\u0631\u0633\u0627\u0644',
    trustLabel:'\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062b\u0642\u0629', trustDesc:'\u062f\u0631\u062c\u0629 \u062b\u0642\u0629 \u0627\u0644\u0636\u062d\u064a\u0629',
    riskLabel:'\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062e\u0637\u0631', riskDesc:'\u062e\u0637\u0631 \u0643\u0634\u0641 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a',
    responsePlaceholder:'\u0627\u0643\u062a\u0628 \u0631\u062f \u0627\u0644\u0636\u062d\u064a\u0629...',
    activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',
    clear:'\u0645\u0633\u062d', copy:'\u0646\u0633\u062e', export:'\u062a\u0635\u062f\u064a\u0631', filterAll:'\u0627\u0644\u0643\u0644',
    settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a', language:'\u0627\u0644\u0644\u063a\u0629', theme:'\u0627\u0644\u0645\u0638\u0647\u0631', soundEffects:'\u0627\u0644\u0645\u0624\u062b\u0631\u0627\u062a \u0627\u0644\u0635\u0648\u062a\u064a\u0629',
    help:'\u0645\u0633\u0627\u0639\u062f\u0629', faq:'\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629', howto:'\u0643\u064a\u0641 \u062a\u0633\u062a\u062e\u062f\u0645', wiki:'\u0648\u064a\u0643\u064a',
    faq_q1:'\u0645\u0627 \u0647\u0648 \u0627\u0644\u062a\u0630\u0631\u0639\u061f', faq_a1:'\u0625\u0646\u0634\u0627\u0621 \u0633\u064a\u0646\u0627\u0631\u064a\u0648 \u0645\u0644\u0641\u0642 \u0644\u0644\u062a\u0644\u0627\u0639\u0628 \u0628\u0627\u0644\u0636\u062d\u064a\u0629.',
    faq_q2:'\u0647\u0644 \u0647\u0630\u0627 \u0647\u062c\u0648\u0645 \u062d\u0642\u064a\u0642\u064a\u061f', faq_a2:'\u0644\u0627. \u0647\u0630\u0647 \u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u062f\u0631\u064a\u0628\u064a\u0629.',
    howto_1:'\u0627\u062e\u062a\u0631 \u0633\u064a\u0646\u0627\u0631\u064a\u0648 \u0648\u0627\u0646\u0642\u0631 \u0628\u062f\u0621.', howto_2:'\u0631\u0627\u0642\u0628 \u0627\u0644\u0645\u062d\u0627\u062f\u062b\u0629.',
    howto_3:'\u0623\u062c\u0628 \u0643\u0627\u0644\u0636\u062d\u064a\u0629.', howto_4:'\u062d\u0644\u0644 \u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u062e\u0637\u0631.',
    wiki_t1:'\u0627\u0644\u062a\u0630\u0631\u0639', wiki_d1:'\u0634\u0643\u0644 \u0645\u0646 \u0627\u0644\u0647\u0646\u062f\u0633\u0629 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a\u0629.',
    ready:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u0630\u0631\u064a\u0639\u0629 \u062c\u0627\u0647\u0632.',
    scenarioStarted:'\u0628\u062f\u0623 \u0627\u0644\u0633\u064a\u0646\u0627\u0631\u064a\u0648: ', analyzing:'\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0644\u064a\u0644...',
    redFlags:'\u0625\u0634\u0627\u0631\u0627\u062a \u062e\u0637\u0631: \u0627\u0633\u062a\u0639\u062c\u0627\u0644\u060c \u0627\u0646\u062a\u062d\u0627\u0644 \u0633\u0644\u0637\u0629\u060c \u0637\u0644\u0628 \u0645\u0639\u0644\u0648\u0645\u0627\u062a.',
    logCleared:'\u062a\u0645 \u0645\u0633\u062d \u0627\u0644\u0633\u062c\u0644', copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!', copyFail:'\u0641\u0634\u0644',
    working:'\u062c\u0627\u0631\u064d...', splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',
    langChanged:'\u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629', themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'
  }
};

let currentLang='en';
function T(k){return(LANG[currentLang]||LANG.en)[k]||k;}

/* ═══════ SOUND ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' \u2014 Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(T('themeChanged')+' '+name,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(T('logCleared'));}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(T('copied'),'success');}catch{log(T('copyFail'),'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
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

/* ═══════ SCENARIOS ═══════ */
const SCENARIOS={
  itsupport:[
    {from:'attacker',msg:'Hi, this is Mike from IT Support. We detected unusual activity on your account.'},
    {from:'attacker',msg:'I need to verify your identity. Can you confirm your employee ID and last password change date?'},
    {from:'attacker',msg:'Great. For security, I need to reset your credentials remotely. Please share your current password so I can migrate it.'}
  ],
  ceo:[
    {from:'attacker',msg:'This is urgent. I\'m in a meeting with the board and I need you to process a wire transfer immediately.'},
    {from:'attacker',msg:'The amount is $47,500. Use the account details I\'m sending you now. Don\'t discuss this with anyone.'},
    {from:'attacker',msg:'I know this is unusual but we\'ll lose the deal. I\'ll explain everything after the meeting.'}
  ],
  delivery:[
    {from:'attacker',msg:'Hello! Your package #DHL-7829 is being held at customs. We need your full name and ID number to release it.'},
    {from:'attacker',msg:'There\'s also a small customs fee of $12.99. Please provide your card details for the payment.'},
    {from:'attacker',msg:'If we don\'t receive the information within 24 hours, the package will be returned to sender.'}
  ],
  bank:[
    {from:'attacker',msg:'Security Alert: Suspicious transaction detected on your account ending in 4521. Amount: $2,340.'},
    {from:'attacker',msg:'To block this transaction, please verify your identity with your full card number and CVV.'},
    {from:'attacker',msg:'Time is critical. If you don\'t respond within 5 minutes, the transaction will be processed.'}
  ]
};

let currentScenario=null, scenarioStep=0, trustLevel=0;

function addChat(from,msg){
  const area=$('chatArea');if(!area)return;
  const d=document.createElement('div');
  d.className='chat-bubble chat-'+from;
  d.textContent=msg;
  area.appendChild(d);
  area.scrollTop=area.scrollHeight;
}

function startScenario(){
  const sel=$('scenarioSelect');
  const key=sel?sel.value:'itsupport';
  currentScenario=SCENARIOS[key]||SCENARIOS.itsupport;
  scenarioStep=0; trustLevel=0;
  const area=$('chatArea');if(area)area.innerHTML='';
  log(T('scenarioStarted')+key,'info');
  setStatus(true);
  advanceScenario();
}

function advanceScenario(){
  if(!currentScenario||scenarioStep>=currentScenario.length)return;
  const step=currentScenario[scenarioStep];
  setTimeout(()=>{
    addChat(step.from,step.msg);
    scenarioStep++;
    trustLevel=Math.min(95,trustLevel+Math.round(Math.random()*20+15));
    $('trustVal').textContent=trustLevel+'%';
    $('riskVal').textContent=trustLevel>70?'HIGH':trustLevel>40?'MEDIUM':'LOW';
    $('riskVal').style.color=trustLevel>70?'#f44':trustLevel>40?'#fa4':'#4f4';
  },1000);
}

function sendResponse(){
  const input=$('responseInput');if(!input||!input.value.trim())return;
  addChat('victim',input.value.trim());
  log('Victim responded: '+input.value.trim(),'info');
  input.value='';
  trustLevel=Math.min(95,trustLevel+10);
  $('trustVal').textContent=trustLevel+'%';
  advanceScenario();
}

function analyzePretext(){
  log(T('analyzing'),'info');
  showToast(T('analyzing'));
  setTimeout(()=>{
    hideToast();
    log(T('redFlags'),'success');
    const rl=$('reportLog');
    if(rl)rl.textContent+='\\n[ANALYSIS] Red flags: urgency, authority impersonation, data request\\n[ANALYSIS] Trust manipulation score: '+trustLevel+'%\\n[ANALYSIS] Verdict: SOCIAL ENGINEERING ATTEMPT';
  },1500);
}

/* ═══════ CANVAS SIM ═══════ */
function initCanvas(){
  const c=$('simCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  c.width=c.offsetWidth||800;c.height=250;
  let t=0;
  const nodes=[];for(let i=0;i<12;i++)nodes.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,r:4+Math.random()*4,label:['Attacker','Victim','IT Dept','CEO','HR','Finance','Reception','Server','Email','Phone','Badge','Database'][i]});
  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,c.width,c.height);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    nodes.forEach((n,i)=>{
      n.x+=n.vx;n.y+=n.vy;
      if(n.x<0||n.x>c.width)n.vx*=-1;
      if(n.y<0||n.y>c.height)n.vy*=-1;
      // connections
      nodes.forEach((m,j)=>{if(j<=i)return;const d=Math.hypot(n.x-m.x,n.y-m.y);if(d<150){ctx.strokeStyle=accent;ctx.globalAlpha=1-d/150;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke();ctx.globalAlpha=1;}});
      ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle=i===0?'#f44':i===1?'#4f4':accent;ctx.fill();
      ctx.fillStyle='#fff';ctx.font='9px Orbitron,monospace';ctx.fillText(n.label,n.x-15,n.y-n.r-4);
    });
    t++;requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const ls=$('langSelect'),ts=$('themeSelect');
  if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  initHijriDate();initCanvas();
  if($('startBtn'))$('startBtn').onclick=startScenario;
  if($('analyzeBtn'))$('analyzeBtn').onclick=analyzePretext;
  if($('sendBtn'))$('sendBtn').onclick=sendResponse;
  if($('responseInput'))$('responseInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendResponse();});
  log(T('ready'),'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
