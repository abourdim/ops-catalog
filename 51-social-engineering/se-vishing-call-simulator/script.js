/**
 * se-vishing-call-simulator — Workshop DIY v1.0
 * Simulate voice phishing calls for training
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
const LANG={
en:{title:'Vishing Call Simulator',subtitle:'Simulate voice phishing calls for training',disconnected:'Disconnected',connected:'Connected',mainSection:'Vishing Call Simulator',mainDesc:'Simulate voice phishing calls for training',sectionA:'Call Visualization',sectionB:'Script Analysis',sectionC:'Call Log',btn1:'Start Call',btn2:'Analyze',metric1Label:'Threat Level',metric1Desc:'Current assessment',metric2Label:'Confidence',metric2Desc:'Analysis confidence',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is vishing?',faq_a1:'Voice phishing: using phone calls to trick victims into revealing information.',faq_q2:'Is this a real attack tool?',faq_a2:'No. This is purely an educational simulator.',howto_1:'Click the primary button to start.',howto_2:'Observe the canvas visualization.',howto_3:'Use the secondary button to analyze.',howto_4:'Review the intelligence log.',wiki_t1:'Vishing Call Simulator',wiki_d1:'Voice phishing: using phone calls to trick victims into revealing information.',ready:'Vishing Call Simulator ready.',action1:'Running primary scan...',action1Done:'Primary scan complete!',action2:'Running analysis...',action2Done:'Analysis complete. Results logged.',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working...',splashHint:'tap to skip',langChanged:'Language \u2192 English',themeChanged:'Theme \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick from 8 themes.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},
fr:{title:'Simulateur d'Appels Vishing',subtitle:'Simuler des appels de phishing vocal',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Simulateur d'Appels Vishing',mainDesc:'Simuler des appels de phishing vocal',sectionA:'Visualisation d'Appel',sectionB:'Analyse du Script',sectionC:'Journal des Appels',btn1:'Démarrer',btn2:'Analyser',metric1Label:'Niveau de Menace',metric1Desc:'\u00c9valuation actuelle',metric2Label:'Confiance',metric2Desc:'Confiance de l\'analyse',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le vishing?',faq_a1:'Phishing vocal par téléphone.',faq_q2:'Est-ce un vrai outil d\'attaque?',faq_a2:'Non. C\'est un simulateur \u00e9ducatif.',howto_1:'Cliquez le bouton principal.',howto_2:'Observez la visualisation.',howto_3:'Utilisez le bouton secondaire.',howto_4:'Consultez le journal.',wiki_t1:'Simulateur d'Appels Vishing',wiki_d1:'Phishing vocal par téléphone.',ready:'Simulateur d'Appels Vishing pr\u00eat.',action1:'Scan principal en cours...',action1Done:'Scan termin\u00e9!',action2:'Analyse en cours...',action2Done:'Analyse termin\u00e9e.',logCleared:'Journal effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',working:'En cours...',splashHint:'appuyer pour passer',langChanged:'Langue \u2192 Fran\u00e7ais',themeChanged:'Th\u00e8me \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',faq_q3:'Puis-je changer le th\u00e8me?',faq_a3:'Oui! Ouvre les Param\u00e8tres et choisis parmi 8 th\u00e8mes.',faq_q4:'Mes donn\u00e9es sont-elles priv\u00e9es?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},
ar:{title:'محاكي مكالمات الاحتيال',subtitle:'محاكاة مكالمات التصيد الصوتي',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'محاكي مكالمات الاحتيال',mainDesc:'محاكاة مكالمات التصيد الصوتي',sectionA:'تصور المكالمة',sectionB:'تحليل النص',sectionC:'سجل المكالمات',btn1:'بدء',btn2:'تحليل',metric1Label:'\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062a\u0647\u062f\u064a\u062f',metric1Desc:'\u0627\u0644\u062a\u0642\u064a\u064a\u0645 \u0627\u0644\u062d\u0627\u0644\u064a',metric2Label:'\u0627\u0644\u062b\u0642\u0629',metric2Desc:'\u062b\u0642\u0629 \u0627\u0644\u062a\u062d\u0644\u064a\u0644',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',faq_q1:'ما هو الفيشنج؟',faq_a1:'التصيد الصوتي عبر الهاتف.',faq_q2:'\u0647\u0644 \u0647\u0630\u0627 \u0623\u062f\u0627\u0629 \u0647\u062c\u0648\u0645\u061f',faq_a2:'\u0644\u0627. \u0645\u062d\u0627\u0643\u064a \u062a\u0639\u0644\u064a\u0645\u064a.',howto_1:'\u0627\u0646\u0642\u0631 \u0627\u0644\u0632\u0631 \u0627\u0644\u0631\u0626\u064a\u0633\u064a.',howto_2:'\u0631\u0627\u0642\u0628 \u0627\u0644\u062a\u0635\u0648\u0631.',howto_3:'\u0627\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0632\u0631 \u0627\u0644\u062b\u0627\u0646\u0648\u064a.',howto_4:'\u0631\u0627\u062c\u0639 \u0627\u0644\u0633\u062c\u0644.',wiki_t1:'محاكي مكالمات الاحتيال',wiki_d1:'التصيد الصوتي عبر الهاتف.',ready:'محاكي مكالمات الاحتيال \u062c\u0627\u0647\u0632.',action1:'\u062c\u0627\u0631\u064d \u0627\u0644\u0645\u0633\u062d...',action1Done:'\u0627\u0643\u062a\u0645\u0644 \u0627\u0644\u0645\u0633\u062d!',action2:'\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0644\u064a\u0644...',action2Done:'\u0627\u0643\u062a\u0645\u0644 \u0627\u0644\u062a\u062d\u0644\u064a\u0644.',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',working:'\u062c\u0627\u0631\u064d...',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',faq_q3:'\u0647\u0644 \u064a\u0645\u0643\u0646\u0646\u064a \u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0633\u0645\u0629\u061f',faq_a3:'\u0646\u0639\u0645! \u0627\u0641\u062a\u062d \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0648\u0627\u062e\u062a\u0631.',faq_q4:'\u0647\u0644 \u0628\u064a\u0627\u0646\u0627\u062a\u064a \u062e\u0627\u0635\u0629\u061f',faq_a4:'\u0646\u0639\u0645. \u0643\u0644 \u0634\u064a\u0621 \u064a\u0639\u0645\u0644 \u0645\u062d\u0644\u064a\u0627\u064b.'}
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

/* ═══════ CANVAS SIM ═══════ */
function initSimCanvas(){
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d');c.width=c.offsetWidth||800;c.height=250;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  
  let t=0;function draw(){ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
    for(let x=0;x<c.width;x++){const y=c.height/2+Math.sin(x*0.03+t*0.05)*50*Math.sin(x*0.008+t*0.02)+Math.sin(x*0.01+t*0.03)*30;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();t++;requestAnimationFrame(draw);}draw();
}
function initAnalysisCanvas(){
  const c2=$('analysisCanvas');if(!c2)return;const ctx2=c2.getContext('2d');c2.width=c2.offsetWidth||800;c2.height=200;
  const accent2=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  
  let t2=0;const data2=Array(50).fill(0);
  function draw2(){ctx2.fillStyle='rgba(0,0,0,0.05)';ctx2.fillRect(0,0,c2.width,c2.height);
    data2.push(Math.random()*100);if(data2.length>50)data2.shift();
    ctx2.strokeStyle=accent2;ctx2.lineWidth=2;ctx2.beginPath();
    data2.forEach((v,i)=>{const x=i*(c2.width/50),y=c2.height-v*1.8;i===0?ctx2.moveTo(x,y):ctx2.lineTo(x,y);});ctx2.stroke();
    ctx2.fillStyle='#fff';ctx2.font='10px Orbitron,monospace';ctx2.fillText('ANALYSIS METRICS',10,15);
    t2++;requestAnimationFrame(draw2);}draw2();
}

/* ═══════ ACTIONS ═══════ */
let metric1=0,metric2=0;
function doAction1(){
  log(T('action1'),'info');showToast(T('action1'));setStatus(true);
  let p=0;const iv=setInterval(()=>{p+=Math.random()*20;metric1=Math.min(100,Math.round(p));
    $('metric1Val').textContent=metric1>70?'HIGH':metric1>40?'MEDIUM':'LOW';
    $('metric1Val').style.color=metric1>70?'#f44':metric1>40?'#fa4':'#4f4';
    metric2=Math.min(99,Math.round(p*0.9));$('metric2Val').textContent=metric2+'%';
    if(p>=100){clearInterval(iv);hideToast();log(T('action1Done'),'success');
      const il=$('intelLog');if(il)il.textContent+='\n[SCAN] Threat level: '+(metric1>70?'HIGH':'MEDIUM')+'\n[SCAN] Confidence: '+metric2+'%\n[SCAN] Vectors identified: '+Math.round(Math.random()*5+3);}
  },300);
}
function doAction2(){
  log(T('action2'),'info');showToast(T('action2'));
  setTimeout(()=>{hideToast();log(T('action2Done'),'success');
    const il=$('intelLog');if(il)il.textContent+='\n[ANALYSIS] Pattern match score: '+Math.round(Math.random()*30+70)+'%\n[ANALYSIS] Risk indicators: '+Math.round(Math.random()*4+2)+'\n[ANALYSIS] Recommendation: Increase monitoring.';
  },1800);
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
  initHijriDate();initSimCanvas();initAnalysisCanvas();
  if($('btn1'))$('btn1').onclick=doAction1;
  if($('btn2'))$('btn2').onclick=doAction2;
  log(T('ready'),'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
