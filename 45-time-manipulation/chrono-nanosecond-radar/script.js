/**
 * Chrono Nanosecond Radar — Workshop DIY v1.2
 * Canvas visualization: timing radar pulses with nanosecond precision
 */
const $=id=>document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2"/><path d="M50 15 L50 50 L75 50" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="currentColor"/></svg>`;
const FOOTER_ICON='';
const LIGHT_THEMES=['riad','medina'];
const APP_VERSION='1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25)}}

/* ═══════ i18n ═══════ */
const LANG={
  en:{title:'Chrono Nanosecond Radar',subtitle:'Nanosecond-precision timing radar',disconnected:'Disconnected',connected:'Scanning',mainSection:'Nanosecond Radar',mainDesc:'Visualize ultra-precise timing pulses and measure nanosecond intervals',sectionA:'Timing Measurements',sectionB:'Theory & Notes',pulseRateLabel:'Pulse Rate (MHz)',precisionLabel:'Precision (ns)',noiseLabel:'Noise Floor',startBtn:'\u25B6 Start Scan',stopBtn:'\u23F9 Stop',resetBtn:'\u21BA Reset',theoryText:'Nanosecond radar uses ultra-short pulses to measure distances with sub-millimeter precision.',theory1:'Round-trip time = 2d/c',theory2:'1 ns \u2248 30 cm resolution',theory3:'Used in ground-penetrating radar',theory4:'Pulse compression enhances resolution',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',settings:'\u2699\uFE0F Settings',language:'Language',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is nanosecond radar?',faq_a1:'Ultra-short pulse radar for precision ranging.',faq_q2:'How to change theme?',faq_a2:'Open Settings and pick a theme.',howto_1:'Set pulse rate and precision.',howto_2:'Click Start to begin simulation.',wiki_themes_title:'Themes',wiki_themes:'8 built-in themes.',ready:'\u23F1 Nanosecond Radar ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'\uD83C\uDF10 Language \u2192 English',themeChanged:'\uD83C\uDFA8 Theme \u2192',filterAll:'All',working:'Working\u2026'},
  fr:{title:'Radar Nanoseconde Chrono',subtitle:'Radar temporel pr\u00e9cision nanoseconde',disconnected:'D\u00e9connect\u00e9',connected:'En balayage',mainSection:'Radar Nanoseconde',mainDesc:'Visualiser des impulsions temporelles ultra-pr\u00e9cises',sectionA:'Mesures Temporelles',sectionB:'Th\u00e9orie & Notes',pulseRateLabel:'Fr\u00e9quence (MHz)',precisionLabel:'Pr\u00e9cision (ns)',noiseLabel:'Plancher de bruit',startBtn:'\u25B6 D\u00e9marrer',stopBtn:'\u23F9 Stop',resetBtn:'\u21BA R\u00e9init',theoryText:'Le radar nanoseconde utilise des impulsions ultra-courtes pour mesurer des distances.',theory1:'Temps aller-retour = 2d/c',theory2:'1 ns \u2248 30 cm de r\u00e9solution',theory3:'Utilis\u00e9 en radar p\u00e9n\u00e9trant',theory4:'La compression d\'impulsion am\u00e9liore la r\u00e9solution',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',theme:'Th\u00e8me',settings:'\u2699\uFE0F Param\u00e8tres',language:'Langue',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le radar nanoseconde?',faq_a1:'Radar \u00e0 impulsions ultra-courtes.',faq_q2:'Comment changer le th\u00e8me?',faq_a2:'Ouvrez Param\u00e8tres.',howto_1:'R\u00e9glez la fr\u00e9quence.',howto_2:'Cliquez D\u00e9marrer.',wiki_themes_title:'Th\u00e8mes',wiki_themes:'8 th\u00e8mes int\u00e9gr\u00e9s.',ready:'\u23F1 Radar Nanoseconde pr\u00eat!',logCleared:'Journal effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais',themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',filterAll:'Tout',working:'En cours\u2026'},
  ar:{title:'\u0631\u0627\u062F\u0627\u0631 \u0627\u0644\u0646\u0627\u0646\u0648\u062B\u0627\u0646\u064A\u0629 \u0643\u0631\u0648\u0646\u0648',subtitle:'\u0631\u0627\u062F\u0627\u0631 \u062A\u0648\u0642\u064A\u062A \u0628\u062F\u0642\u0629 \u0627\u0644\u0646\u0627\u0646\u0648\u062B\u0627\u0646\u064A\u0629',disconnected:'\u063A\u064A\u0631 \u0645\u062A\u0635\u0644',connected:'\u064A\u0645\u0633\u062D',mainSection:'\u0631\u0627\u062F\u0627\u0631 \u0627\u0644\u0646\u0627\u0646\u0648\u062B\u0627\u0646\u064A\u0629',mainDesc:'\u062A\u0635\u0648\u0631 \u0646\u0628\u0636\u0627\u062A \u0627\u0644\u062A\u0648\u0642\u064A\u062A \u0641\u0627\u0626\u0642\u0629 \u0627\u0644\u062F\u0642\u0629',sectionA:'\u0642\u064A\u0627\u0633\u0627\u062A \u0627\u0644\u062A\u0648\u0642\u064A\u062A',sectionB:'\u0627\u0644\u0646\u0638\u0631\u064A\u0629',pulseRateLabel:'\u0645\u0639\u062F\u0644 \u0627\u0644\u0646\u0628\u0636 (MHz)',precisionLabel:'\u0627\u0644\u062F\u0642\u0629 (ns)',noiseLabel:'\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0636\u0648\u0636\u0627\u0621',startBtn:'\u25B6 \u0628\u062F\u0621 \u0627\u0644\u0645\u0633\u062D',stopBtn:'\u23F9 \u0625\u064A\u0642\u0627\u0641',resetBtn:'\u21BA \u0625\u0639\u0627\u062F\u0629',theoryText:'\u064A\u0633\u062A\u062E\u062F\u0645 \u0631\u0627\u062F\u0627\u0631 \u0627\u0644\u0646\u0627\u0646\u0648\u062B\u0627\u0646\u064A\u0629 \u0646\u0628\u0636\u0627\u062A \u0642\u0635\u064A\u0631\u0629 \u062C\u062F\u0627\u064B \u0644\u0642\u064A\u0627\u0633 \u0627\u0644\u0645\u0633\u0627\u0641\u0627\u062A.',theory1:'\u0632\u0645\u0646 \u0627\u0644\u0630\u0647\u0627\u0628 \u0648\u0627\u0644\u0625\u064A\u0627\u0628 = 2d/c',theory2:'1 \u0646\u0627\u0646\u0648\u062B\u0627\u0646\u064A\u0629 \u2248 30 \u0633\u0645',theory3:'\u064A\u0633\u062A\u062E\u062F\u0645 \u0641\u064A \u0627\u0644\u0631\u0627\u062F\u0627\u0631 \u0627\u0644\u0645\u062E\u062A\u0631\u0642 \u0644\u0644\u0623\u0631\u0636',theory4:'\u0636\u063A\u0637 \u0627\u0644\u0646\u0628\u0636\u0627\u062A \u064A\u062D\u0633\u0646 \u0627\u0644\u062F\u0642\u0629',activityLog:'\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B',clear:'\u0645\u0633\u062D',copy:'\u0646\u0633\u062E',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u2699\uFE0F \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',language:'\u0627\u0644\u0644\u063A\u0629',help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064A\u0641',wiki:'\u0648\u064A\u0643\u064A',faq_q1:'\u0645\u0627 \u0647\u0648 \u0631\u0627\u062F\u0627\u0631 \u0627\u0644\u0646\u0627\u0646\u0648\u062B\u0627\u0646\u064A\u0629\u061F',faq_a1:'\u0631\u0627\u062F\u0627\u0631 \u0628\u0646\u0628\u0636\u0627\u062A \u0642\u0635\u064A\u0631\u0629 \u062C\u062F\u0627\u064B.',faq_q2:'\u0643\u064A\u0641 \u0623\u063A\u064A\u0631 \u0627\u0644\u0645\u0638\u0647\u0631\u061F',faq_a2:'\u0627\u0641\u062A\u062D \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A.',howto_1:'\u0627\u0636\u0628\u0637 \u0645\u0639\u062F\u0644 \u0627\u0644\u0646\u0628\u0636.',howto_2:'\u0627\u0646\u0642\u0631 \u0628\u062F\u0621.',wiki_themes_title:'\u0627\u0644\u0645\u0638\u0627\u0647\u0631',wiki_themes:'8 \u0645\u0638\u0627\u0647\u0631 \u0645\u062F\u0645\u062C\u0629.',ready:'\u23F1 \u0631\u0627\u062F\u0627\u0631 \u0627\u0644\u0646\u0627\u0646\u0648\u062B\u0627\u0646\u064A\u0629 \u062C\u0627\u0647\u0632!',logCleared:'\u062A\u0645 \u0627\u0644\u0645\u0633\u062D',copied:'\u062A\u0645 \u0627\u0644\u0646\u0633\u062E!',copyFail:'\u0641\u0634\u0644',soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A \u0635\u0648\u062A\u064A\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629',themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',filterAll:'\u0627\u0644\u0643\u0644',working:'\u062C\u0627\u0631\u064D\u2026'}
};
let currentLang='en';

/* ═══════ TEMPLATE ENGINE ═══════ */
function applyLang(lang){currentLang=lang;const t=LANG[lang]||LANG.en;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(t[k])el.textContent=t[k]});if(lang==='ar'){document.documentElement.dir='rtl';document.documentElement.lang='ar'}else{document.documentElement.dir='ltr';document.documentElement.lang=lang}}
function dismissSplash(){const s=$('splash');if(s)s.style.opacity='0';setTimeout(()=>{if(s)s.style.display='none'},500)}
setTimeout(dismissSplash,3000);

/* ═══════ PANELS ═══════ */
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('open')}
$('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
$('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
$('logBtn').onclick=()=>togglePanel($('logPanel'));
$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));

/* ═══════ SETTINGS ═══════ */
$('langSelect').onchange=e=>{applyLang(e.target.value);addLog('info',LANG[e.target.value].langChanged)};
$('themeSelect').onchange=e=>{document.documentElement.setAttribute('data-theme',e.target.value);addLog('info',LANG[currentLang].themeChanged+' '+e.target.value)};
$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};

/* Help tabs */
document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=document.getElementById('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active')}});

/* ═══════ LOG ═══════ */
const logEntries=[];
function addLog(type,msg){const now=new Date().toLocaleTimeString();logEntries.push({type,msg,time:now});const d=document.createElement('div');d.className='log-entry log-'+type;d.innerHTML=`<span class="log-time">${now}</span> <span>${msg}</span>`;$('logContainer').prepend(d)}
$('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';logEntries.length=0;addLog('info',LANG[currentLang].logCleared)};
$('copyLogBtn').onclick=()=>{const t=logEntries.map(e=>`[${e.time}] ${e.type}: ${e.msg}`).join('\n');navigator.clipboard.writeText(t).then(()=>addLog('success',LANG[currentLang].copied)).catch(()=>addLog('error',LANG[currentLang].copyFail))};
document.querySelectorAll('.log-filter').forEach(f=>{f.onclick=()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));f.classList.add('active');const ft=f.dataset.filter;document.querySelectorAll('.log-entry').forEach(e=>{e.style.display=ft==='all'||e.classList.contains('log-'+ft)?'':'none'})}});

/* ═══════ SIMULATION STATE ═══════ */
let running=false,animId=null,t=0;
const pulseData=[],histData=new Array(50).fill(0);

/* ═══════ CANVAS: Main Radar ═══════ */
function drawMain(){const c=$('mainCanvas'),ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=300*2;ctx.scale(2,2);const w=W/2,h=H/2;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  // Radar sweep
  const cx=w/2,cy=h/2,r=Math.min(w,h)/2-10;
  ctx.strokeStyle='rgba(0,255,120,.15)';ctx.lineWidth=1;
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,r*i/4,0,Math.PI*2);ctx.stroke()}
  // Sweep line
  const angle=(t*0.02)%(Math.PI*2);
  const grad=ctx.createLinearGradient(cx,cy,cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);
  grad.addColorStop(0,'rgba(0,255,120,.8)');grad.addColorStop(1,'rgba(0,255,120,0)');
  ctx.strokeStyle=grad;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
  // Afterglow
  for(let i=0;i<20;i++){const a=angle-i*0.015;const alpha=0.3*(1-i/20);ctx.strokeStyle=`rgba(0,255,120,${alpha})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.stroke()}
  // Targets
  const noise=$('noiseSlider').value/100;
  const precision=$('precisionSlider').value;
  for(let i=0;i<5;i++){const ta=Math.sin(t*0.01+i*1.3)*Math.PI*2;const tr=(0.3+i*0.12)*r;const diff=Math.abs(((angle-ta)%(Math.PI*2)+Math.PI*2)%(Math.PI*2));if(diff<0.3){const brightness=1-diff/0.3;const tx=cx+Math.cos(ta)*tr+Math.random()*noise*5;const ty=cy+Math.sin(ta)*tr+Math.random()*noise*5;ctx.fillStyle=`rgba(0,255,120,${brightness})`;ctx.beginPath();ctx.arc(tx,ty,3+brightness*4,0,Math.PI*2);ctx.fill()}}
  // Labels
  ctx.fillStyle='rgba(0,255,120,.6)';ctx.font='10px Orbitron';ctx.fillText(`PRF: ${$('pulseRateSlider').value} MHz`,10,15);
  ctx.fillText(`Precision: ${precision} ns`,10,28);
  ctx.fillText(`t = ${(t*0.016).toFixed(2)}s`,w-80,15);
}

/* ═══════ CANVAS: Pulse Timing ═══════ */
function drawPulse(){const c=$('pulseCanvas'),ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=150*2;ctx.scale(2,2);const w=W/2,h=H/2;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(0,180,255,.3)';ctx.lineWidth=1;
  for(let y=0;y<h;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
  const rate=$('pulseRateSlider').value;const noise=$('noiseSlider').value/100;
  ctx.strokeStyle='#00ff78';ctx.lineWidth=1.5;ctx.beginPath();
  for(let x=0;x<w;x++){const phase=(x/w*rate*2+t*0.05)%(1);const pulse=phase<0.1?Math.sin(phase/0.1*Math.PI):0;const n=Math.random()*noise*0.3;const y=h/2-(pulse+n)*(h/2-10);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
  ctx.stroke();
  ctx.fillStyle='rgba(0,180,255,.5)';ctx.font='9px Orbitron';ctx.fillText('PULSE TIMING',5,12);
}

/* ═══════ CANVAS: Histogram ═══════ */
function drawHist(){const c=$('histCanvas'),ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=150*2;ctx.scale(2,2);const w=W/2,h=H/2;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  if(running){histData.shift();histData.push(Math.random()*0.6+0.2+Math.sin(t*0.03)*0.2)}
  const bw=w/histData.length;
  for(let i=0;i<histData.length;i++){const bh=histData[i]*(h-20);const hue=120+histData[i]*120;ctx.fillStyle=`hsla(${hue},80%,50%,.7)`;ctx.fillRect(i*bw+1,h-bh,bw-2,bh)}
  ctx.fillStyle='rgba(255,200,0,.5)';ctx.font='9px Orbitron';ctx.fillText('ROUND-TRIP HISTOGRAM',5,12);
}

/* ═══════ INFO GRID ═══════ */
function updateInfo(){const g=$('infoGrid');const precision=$('precisionSlider').value;const rate=$('pulseRateSlider').value;
  g.innerHTML=`<div class="info-card"><div class="big">${rate} MHz</div><div class="sub">Pulse Rate</div></div><div class="info-card"><div class="big">${precision} ns</div><div class="sub">Precision</div></div><div class="info-card"><div class="big">${(precision*0.3).toFixed(1)} cm</div><div class="sub">Resolution</div></div><div class="info-card"><div class="big">${running?'ACTIVE':'IDLE'}</div><div class="sub">Status</div></div>`}

/* ═══════ ANIMATION LOOP ═══════ */
function frame(){if(!running)return;t++;drawMain();drawPulse();drawHist();updateInfo();animId=requestAnimationFrame(frame)}

/* ═══════ CONTROLS ═══════ */
$('startBtn').onclick=()=>{if(running)return;running=true;$('statusDot').className='status-dot connected';$('statusText').textContent=LANG[currentLang].connected;addLog('success','Radar scan started');playSound('success');frame()};
$('stopBtn').onclick=()=>{running=false;if(animId)cancelAnimationFrame(animId);$('statusDot').className='status-dot';$('statusText').textContent=LANG[currentLang].disconnected;addLog('info','Radar scan stopped');playSound('click')};
$('resetBtn').onclick=()=>{running=false;if(animId)cancelAnimationFrame(animId);t=0;histData.fill(0);$('statusDot').className='status-dot';$('statusText').textContent=LANG[currentLang].disconnected;drawMain();drawPulse();drawHist();updateInfo();addLog('info','Reset complete');playSound('click')};

$('pulseRateSlider').oninput=e=>$('pulseRateVal').textContent=e.target.value;
$('precisionSlider').oninput=e=>$('precisionVal').textContent=e.target.value;
$('noiseSlider').oninput=e=>$('noiseVal').textContent=e.target.value;

/* ═══════ INIT ═══════ */
function init(){if($('logoWrap'))$('logoWrap').innerHTML=LOGO_SVG;if($('splashLogo'))$('splashLogo').innerHTML=LOGO_SVG;drawMain();drawPulse();drawHist();updateInfo();addLog('info',LANG[currentLang].ready)}
document.addEventListener('DOMContentLoaded',init);
