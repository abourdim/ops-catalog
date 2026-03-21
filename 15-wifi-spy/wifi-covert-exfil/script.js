/**
 * Covert Exfil — WiFi Data Tunneling
 * DNS tunneling, ICMP covert channels, steganography simulation
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}

const LANG={
en:{title:'Covert Exfil — WiFi Data Tunneling',subtitle:'Data tunneling through WiFi channels',disconnected:'Disconnected',connected:'Exfiltrating',mainSection:'Covert Exfiltration',mainDesc:'DNS tunneling & steganography simulation',sectionA:'Packet Stream',sectionC:'How It Works',start:'Start',stop:'Stop',totalBytes:'Bytes Sent',packets:'Packets',throughput:'B/s',detection:'Detection',howItWorksText:'Covert exfiltration uses legitimate protocols to hide data transfers. DNS tunneling encodes data in DNS queries. ICMP covert channels embed data in ping packets. Steganography hides data within WiFi beacon frames. This simulation demonstrates these techniques for educational purposes.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is covert exfiltration?',faq_a1:'Hiding data within legitimate network traffic.',faq_q2:'Is this real?',faq_a2:'No, simulation only.',faq_q3:'What is DNS tunneling?',faq_a3:'Encoding data within DNS packets.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Select an exfiltration method.',howto_2:'Click Start to begin.',howto_3:'Watch the data flow visualization.',howto_4:'Monitor the packet stream.',wiki_dns_title:'DNS Tunneling',wiki_dns:'Encodes data as DNS subdomains.',wiki_steg_title:'Steganography',wiki_steg:'Hides data within other data.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Covert Exfil ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Exfiltration started',simStopped:'Exfiltration stopped',pktSent:'Packet sent',riskLow:'Low',riskMed:'Medium',riskHigh:'High'},
fr:{title:'Exfil Furtive — Tunnel WiFi',subtitle:'Tunnelisation de donnees via WiFi',disconnected:'Deconnecte',connected:'Exfiltration',mainSection:'Exfiltration Furtive',mainDesc:'Simulation tunnel DNS et steganographie',sectionA:'Flux de Paquets',sectionC:'Comment ca marche',start:'Demarrer',stop:'Arreter',totalBytes:'Octets',packets:'Paquets',throughput:'O/s',detection:'Detection',howItWorksText:'L\'exfiltration furtive utilise des protocoles legitimes pour cacher les transferts de donnees. Le tunneling DNS encode les donnees dans les requetes DNS.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que l\'exfiltration?',faq_a1:'Cacher des donnees dans le trafic reseau.',faq_q2:'Est-ce reel?',faq_a2:'Non, simulation.',faq_q3:'Qu\'est-ce que le tunnel DNS?',faq_a3:'Encoder des donnees dans les paquets DNS.',faq_q4:'Donnees privees?',faq_a4:'Oui.',howto_1:'Selectionnez une methode.',howto_2:'Cliquez Demarrer.',howto_3:'Observez le flux.',howto_4:'Surveillez les paquets.',wiki_dns_title:'Tunnel DNS',wiki_dns:'Encode les donnees en sous-domaines.',wiki_steg_title:'Steganographie',wiki_steg:'Cache des donnees dans d\'autres donnees.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Exfiltration demarree',simStopped:'Exfiltration arretee',pktSent:'Paquet envoye',riskLow:'Faible',riskMed:'Moyen',riskHigh:'Eleve'},
ar:{title:'تسريب خفي — نفق بيانات WiFi',subtitle:'تمرير البيانات عبر قنوات WiFi',disconnected:'غير متصل',connected:'تسريب',mainSection:'تسريب خفي',mainDesc:'محاكاة نفق DNS وإخفاء المعلومات',sectionA:'تدفق الحزم',sectionC:'كيف يعمل',start:'بدء',stop:'إيقاف',totalBytes:'بايت مرسل',packets:'حزم',throughput:'بايت/ث',detection:'كشف',howItWorksText:'التسريب الخفي يستخدم بروتوكولات شرعية لإخفاء نقل البيانات. نفق DNS يشفر البيانات في استعلامات DNS.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو التسريب الخفي؟',faq_a1:'إخفاء البيانات في حركة الشبكة.',faq_q2:'هل هذا حقيقي؟',faq_a2:'لا، محاكاة فقط.',faq_q3:'ما هو نفق DNS؟',faq_a3:'تشفير البيانات في حزم DNS.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم.',howto_1:'اختر طريقة التسريب.',howto_2:'انقر بدء.',howto_3:'شاهد تدفق البيانات.',howto_4:'راقب الحزم.',wiki_dns_title:'نفق DNS',wiki_dns:'يشفر البيانات كنطاقات فرعية.',wiki_steg_title:'إخفاء المعلومات',wiki_steg:'يخفي البيانات في بيانات أخرى.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ التسريب',simStopped:'توقف التسريب',pktSent:'تم إرسال حزمة',riskLow:'منخفض',riskMed:'متوسط',riskHigh:'مرتفع'}
};

/* === MORSE CODE EASTER EGG === */
function initMorseEasterEgg(){
 if(document.getElementById('morseHint'))return;
 var MORSE_MAP={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z'};
 var morseSeq=[];var morseTimer=null;var keyDownTime=0;
 var hint=document.createElement('span');hint.id='morseHint';hint.textContent='|';hint.title='Morse';hint.style.cssText='opacity:0.3;cursor:default;font-size:0.7rem;margin:0 4px;';
 var footer=document.querySelector('footer')||document.querySelector('.footer');
 if(footer)footer.appendChild(hint);
 function decodeMorse(){
  var letters=[];var current='';
  for(var i=0;i<morseSeq.length;i++){
   if(morseSeq[i]===' '){if(current){letters.push(MORSE_MAP[current]||'?');current='';}}
   else{current+=morseSeq[i];}
  }
  if(current)letters.push(MORSE_MAP[current]||'?');
  var word=letters.join('');
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  if(word==='SOS'){
   var flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:white;z-index:999999;opacity:0.8;transition:opacity 0.5s;';
   document.body.appendChild(flash);setTimeout(function(){flash.style.opacity='0';setTimeout(function(){flash.remove();},500);},200);
   var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
   var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:420px;width:90%;color:var(--text,#e4ddd0);text-align:center;';
   box.innerHTML='<h3 style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;">'+((L.morseSecret)||'Morse Easter Egg')+'</h3><p style="margin:1rem 0;font-style:italic;line-height:1.6;">'+((L.morseBackstory)||'Origin unknown.')+'</p><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);
  }else if(word==='HELP'){
   var helpBtn=document.querySelector('[data-panel="help"]')||document.querySelector('.btn-help')||document.querySelector('[title="Help"]');
   if(helpBtn)helpBtn.click();
  }
  if(word.length>0){console.log((L.morseDecoded||'Decoded: ')+word);}
  morseSeq=[];
 }
 document.addEventListener('keydown',function(e){
  if(e.code!=='Space'||e.repeat||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  e.preventDefault();keyDownTime=Date.now();if(morseTimer)clearTimeout(morseTimer);
 });
 document.addEventListener('keyup',function(e){
  if(e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  var dur=Date.now()-keyDownTime;
  morseSeq.push(dur<200?'.':'-');
  if(morseTimer)clearTimeout(morseTimer);
  morseTimer=setTimeout(function(){morseSeq.push(' ');morseTimer=setTimeout(decodeMorse,1000);},300);
 });
}

/* === DNA FINGERPRINT VISUALIZER === */
function initDNAFingerprint(){
 if(document.getElementById('dnaBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var dnaBtn=document.createElement('button');dnaBtn.id='dnaBtn';dnaBtn.className='btn-icon-only';
 dnaBtn.textContent='\uD83E\uDDEC';dnaBtn.title=L.dnaTitle||'DNA Fingerprint';dnaBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(dnaBtn);else{dnaBtn.style.cssText+='position:fixed;top:0.5rem;right:6rem;z-index:9999;';document.body.appendChild(dnaBtn);}
 var panel=null;var canvas=null;var animId=null;
 function getSliderHues(){
  var sliders=document.querySelectorAll('input[type="range"]');var hues=[];
  sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);var ratio=(val-min)/(max-min||1);hues.push(Math.round(ratio*360));});
  if(hues.length===0)hues=[0,120,240];return hues;
 }
 function drawDNA(){
  if(!canvas)return;var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;
  ctx.clearRect(0,0,w,h);var hues=getSliderHues();var t=Date.now()/1000;
  for(var x=0;x<w;x+=4){
   var phase=x/w*Math.PI*4+t;var y1=h/2+Math.sin(phase)*25;var y2=h/2+Math.sin(phase+Math.PI)*25;
   var hIdx=Math.floor((x/w)*hues.length)%hues.length;var hue=hues[hIdx]||0;
   ctx.beginPath();ctx.arc(x,y1,2,0,Math.PI*2);ctx.fillStyle='hsl('+hue+',80%,60%)';ctx.fill();
   ctx.beginPath();ctx.arc(x,y2,2,0,Math.PI*2);ctx.fillStyle='hsl('+(hue+180)%360+',80%,60%)';ctx.fill();
   if(x%12<4){ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='hsla('+hue+',60%,50%,0.3)';ctx.lineWidth=1;ctx.stroke();}
  }
  animId=requestAnimationFrame(drawDNA);
 }
 dnaBtn.onclick=function(){
  if(panel){panel.remove();panel=null;if(animId)cancelAnimationFrame(animId);return;}
  panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:80px;right:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;text-align:center;';
  panel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:6px;">'+(L.dnaTitle||'DNA Fingerprint')+'</div>';
  canvas=document.createElement('canvas');canvas.width=200;canvas.height=80;canvas.style.cssText='border-radius:8px;background:rgba(0,0,0,0.3);display:block;';
  panel.appendChild(canvas);
  var saveBtn=document.createElement('button');saveBtn.textContent=L.dnaSave||'Save DNA';
  saveBtn.style.cssText='margin-top:8px;background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;';
  saveBtn.onclick=function(){var link=document.createElement('a');link.download='dna-fingerprint.png';link.href=canvas.toDataURL();link.click();};
  panel.appendChild(saveBtn);
  var info=document.createElement('div');info.style.cssText='color:var(--text,#e4ddd0);font-size:0.65rem;opacity:0.7;margin-top:4px;';info.textContent=L.dnaInfo||'Unique visual signature';
  panel.appendChild(info);document.body.appendChild(panel);drawDNA();
 };
}

/* === SANDBOX MODE === */
function initSandboxMode(){
 if(document.getElementById('sandboxBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var active=false;var originals=[];var customCount=0;
 var sandboxBtn=document.createElement('button');sandboxBtn.id='sandboxBtn';sandboxBtn.className='btn-icon-only';
 sandboxBtn.textContent='\uD83D\uDD27';sandboxBtn.title=L.sandboxTitle||'Sandbox Mode';sandboxBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(sandboxBtn);else{sandboxBtn.style.cssText+='position:fixed;top:0.5rem;right:9rem;z-index:9999;';document.body.appendChild(sandboxBtn);}
 var controlPanel=null;
 function storeOriginals(){
  originals=[];document.querySelectorAll('input[type="range"]').forEach(function(s){
   originals.push({el:s,min:s.min,max:s.max,val:s.value,step:s.step});
  });
 }
 function unlockSliders(){
  document.querySelectorAll('input[type="range"]').forEach(function(s){s.min='0';s.max='100';});
 }
 function restoreSliders(){
  originals.forEach(function(o){o.el.min=o.min;o.el.max=o.max;o.el.value=o.val;o.el.step=o.step;o.el.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function addCustomSlider(){
  customCount++;
  var name=prompt('Parameter name:','Custom-'+customCount);if(!name)return;
  var wrap=document.createElement('div');wrap.className='sandbox-custom-slider';wrap.style.cssText='margin:8px 0;padding:6px;background:rgba(0,0,0,0.2);border-radius:8px;';
  var lbl=document.createElement('label');lbl.textContent=name;lbl.style.cssText='color:var(--accent,#d4a03c);font-size:0.75rem;display:block;';
  var sl=document.createElement('input');sl.type='range';sl.min='0';sl.max='100';sl.value='50';sl.style.cssText='width:100%;';
  var valSpan=document.createElement('span');valSpan.textContent='50';valSpan.style.cssText='color:var(--text,#e4ddd0);font-size:0.7rem;';
  sl.oninput=function(){valSpan.textContent=sl.value;console.log('[Sandbox] '+name+': '+sl.value);};
  wrap.appendChild(lbl);wrap.appendChild(sl);wrap.appendChild(valSpan);
  if(controlPanel)controlPanel.appendChild(wrap);
 }
 sandboxBtn.onclick=function(){
  active=!active;
  if(active){
   sandboxBtn.style.background='var(--accent,#d4a03c)';sandboxBtn.style.color='#000';sandboxBtn.style.borderRadius='6px';
   storeOriginals();unlockSliders();
   controlPanel=document.createElement('div');controlPanel.id='sandboxPanel';
   controlPanel.style.cssText='position:fixed;bottom:80px;left:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;min-width:200px;max-height:300px;overflow-y:auto;';
   controlPanel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:8px;">'+(L.sandboxOn||'Sandbox ON')+'</div>';
   var addBtn=document.createElement('button');addBtn.textContent=L.sandboxAdd||'Add Parameter';
   addBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:700;margin-right:6px;';
   addBtn.onclick=addCustomSlider;
   var resetBtn=document.createElement('button');resetBtn.textContent=L.sandboxReset||'Reset Defaults';
   resetBtn.style.cssText='background:transparent;color:var(--accent,#d4a03c);border:1px solid var(--accent,#d4a03c);padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;';
   resetBtn.onclick=function(){restoreSliders();};
   controlPanel.appendChild(addBtn);controlPanel.appendChild(resetBtn);document.body.appendChild(controlPanel);
  }else{
   sandboxBtn.style.background='';sandboxBtn.style.color='';sandboxBtn.style.borderRadius='';
   restoreSliders();
   if(controlPanel){controlPanel.remove();controlPanel=null;}
   document.querySelectorAll('.sandbox-custom-slider').forEach(function(el){el.remove();});
  }
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initMorseEasterEgg();}catch(e){console.warn('Morse init:',e);}try{initDNAFingerprint();}catch(e){console.warn('DNA init:',e);}try{initSandboxMode();}catch(e){console.warn('Sandbox init:',e);}});



let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`exfil-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Covert Exfil ═══════ */
let simRunning=false,simInterval=null,totalBytes=0,packetCount=0,startTime=0,currentMethod='dns';
const DOMAINS=['mail.google.com','cdn.cloudflare.com','api.github.com','update.microsoft.com','fonts.googleapis.com','static.amazon.com'];
let canvas,ctx,particles=[];

function randHex(n){let s='';for(let i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s}

function genPacket(){
  const sz=32+Math.floor(Math.random()*220);
  if(currentMethod==='dns'){
    const dom=DOMAINS[Math.floor(Math.random()*DOMAINS.length)];
    return {type:'DNS',data:`${randHex(12)}.${dom}`,size:sz};
  }else if(currentMethod==='icmp'){
    return {type:'ICMP',data:`echo req seq=${packetCount} data=${randHex(16)}`,size:sz};
  }else{
    return {type:'STEG',data:`beacon[${randHex(8)}] payload=${randHex(20)}`,size:sz};
  }
}

function initCanvas(){
  canvas=$('exfilCanvas');if(!canvas)return;
  ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;
  ctx.scale(2,2);
}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.offsetWidth,h=canvas.offsetHeight;
  ctx.fillStyle='rgba(10,10,26,0.15)';ctx.fillRect(0,0,w,h);
  const colors={dns:'#22c55e',icmp:'#3b82f6',steg:'#a855f7'};
  particles.forEach((p,i)=>{
    p.x+=p.vx;p.y+=p.vy;p.life-=0.01;
    if(p.life<=0){particles.splice(i,1);return;}
    ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
    ctx.fillStyle=colors[p.method]||(colors.dns);ctx.globalAlpha=p.life*0.8;ctx.fill();ctx.globalAlpha=1;
    // draw connecting lines
    if(i>0&&i<particles.length){
      const prev=particles[i-1];
      ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x,p.y);
      ctx.strokeStyle=colors[p.method]||'#22c55e';ctx.globalAlpha=p.life*0.2;ctx.lineWidth=0.5;ctx.stroke();ctx.globalAlpha=1;
    }
  });
  // draw data flow arrow
  const t=(Date.now()%3000)/3000;
  const ax=t*w,ay=h/2+Math.sin(t*Math.PI*4)*20;
  ctx.beginPath();ctx.arc(ax,ay,4,0,Math.PI*2);ctx.fillStyle=colors[currentMethod];ctx.globalAlpha=0.9;ctx.fill();ctx.globalAlpha=1;
}

function addParticles(){
  const w=canvas?canvas.offsetWidth:300,h=canvas?canvas.offsetHeight:200;
  for(let i=0;i<3;i++){
    particles.push({x:Math.random()*w*0.2,y:h/2+Math.random()*40-20,vx:1+Math.random()*2,vy:(Math.random()-0.5)*0.5,r:2+Math.random()*3,life:1,method:currentMethod});
  }
  if(particles.length>200)particles.splice(0,50);
}

function updateUI(){
  $('totalBytes').textContent=totalBytes>1024?(totalBytes/1024).toFixed(1)+'K':totalBytes;
  $('packetCount').textContent=packetCount;
  const elapsed=(Date.now()-startTime)/1000;
  $('throughput').textContent=elapsed>0?Math.round(totalBytes/elapsed):'0';
  const risk=packetCount<20?'riskLow':packetCount<60?'riskMed':'riskHigh';
  $('detectionRisk').textContent=LANG[currentLang][risk];
  $('detectionRisk').style.color=risk==='riskLow'?'#22c55e':risk==='riskMed'?'#fbbf24':'#ef4444';
}

function addPacketToList(pkt){
  const list=$('packetList');if(!list)return;
  const d=document.createElement('div');d.className='packet-item';
  d.innerHTML=`<span class="pkt-type">${pkt.type}</span><span class="pkt-data">${pkt.data}</span><span class="pkt-size">${pkt.size}B</span>`;
  list.insertBefore(d,list.firstChild);
  if(list.children.length>100)list.removeChild(list.lastChild);
}

function simTick(){
  const pkt=genPacket();totalBytes+=pkt.size;packetCount++;
  addPacketToList(pkt);addParticles();updateUI();
  log(`${LANG[currentLang].pktSent}: ${pkt.type} ${pkt.size}B`,'tx');
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  totalBytes=0;packetCount=0;startTime=Date.now();particles=[];
  initCanvas();
  log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(simTick,600);
  requestAnimationFrame(function loop(){if(!simRunning)return;drawCanvas();requestAnimationFrame(loop)});
}

function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  // Method tabs
  document.querySelectorAll('.method-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.method-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');currentMethod=tab.dataset.method;playSound('click');
    });
  });
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS SIMULATION — Data Exfiltration Matrix ═══════ */
(function exfilMatrixCanvas(){
  const CVS_ID='exfilMatrixVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">🕵️</span> Exfiltration Data Matrix</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const columns=[];let _raf=null,frameCount=0;
  function initColumns(w){
    const numCols=Math.floor(w/14);
    while(columns.length<numCols){
      columns.push({chars:[],speed:0.5+Math.random()*2,y:-Math.random()*200});
    }
  }
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    frameCount++;
    initColumns(w);
    const methodColors={dns:'#22c55e',icmp:'#3b82f6',steg:'#a855f7'};
    const activeColor=methodColors[typeof currentMethod!=='undefined'?currentMethod:'dns']||'#22c55e';
    const isRunning=typeof simRunning!=='undefined'&&simRunning;
    // Matrix rain columns
    columns.forEach((col,i)=>{
      if(!isRunning){col.speed*=0.98;return;}
      col.y+=col.speed;
      if(col.y>h+20){col.y=-20;col.speed=0.5+Math.random()*2;}
      const x=i*14+7;
      // Leading bright character
      const ch='0123456789abcdef'[Math.floor(Math.random()*16)];
      ctx.font='10px monospace';ctx.fillStyle=activeColor;ctx.globalAlpha=0.9;ctx.textAlign='center';
      ctx.fillText(ch,x,col.y);
      // Trail
      for(let t=1;t<15;t++){
        const ty=col.y-t*12;if(ty<0)break;
        const tc='0123456789abcdef:./'[Math.floor(Math.random()*19)];
        ctx.globalAlpha=Math.max(0,0.5-t*0.04);
        ctx.fillStyle=activeColor;
        ctx.fillText(tc,x,ty);
      }
      ctx.globalAlpha=1;
    });
    // Data flow tunnel in center
    if(isRunning){
      const cx=w/2,tunnelW=w*0.6;
      // Source label
      ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.3)';ctx.textAlign='left';
      ctx.fillText('SOURCE',10,h/2-2);
      ctx.textAlign='right';ctx.fillText('EXFIL',w-10,h/2-2);
      // Tunnel
      ctx.beginPath();ctx.moveTo(w*0.15,h/2-15);ctx.lineTo(w*0.85,h/2-15);
      ctx.lineTo(w*0.85,h/2+15);ctx.lineTo(w*0.15,h/2+15);ctx.closePath();
      ctx.fillStyle=activeColor+'08';ctx.fill();
      ctx.strokeStyle=activeColor+'20';ctx.lineWidth=1;ctx.stroke();
      // Flowing data packets
      for(let p=0;p<8;p++){
        const t=((frameCount*3+p*40)%(w*0.7))/(w*0.7);
        const px=w*0.15+t*w*0.7;
        const py=h/2+Math.sin(t*Math.PI*6)*8;
        ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle=activeColor;ctx.globalAlpha=0.6;ctx.fill();
        // Packet label
        ctx.font='6px monospace';ctx.fillStyle=activeColor;ctx.globalAlpha=0.4;ctx.textAlign='center';
        const labels={dns:'DNS',icmp:'ICMP',steg:'STEG'};
        ctx.fillText(labels[typeof currentMethod!=='undefined'?currentMethod:'dns']||'DNS',px,py-6);
        ctx.globalAlpha=1;
      }
      // Throughput bar
      const bytes=typeof totalBytes!=='undefined'?totalBytes:0;
      const maxBytes=50000;const pct=Math.min(1,bytes/maxBytes);
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(10,h-15,w-20,8);
      ctx.fillStyle=activeColor+'80';ctx.fillRect(10,h-15,(w-20)*pct,8);
      ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.4)';ctx.textAlign='center';
      ctx.fillText((bytes>1024?(bytes/1024).toFixed(1)+'K':bytes)+' bytes exfiltrated',w/2,h-4);
    }
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
