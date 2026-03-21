/**
 * Workshop DIY — Network Map v1.2
 * Spy Graph — Map peer connections as a spy network
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}else{o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}}

const LANG={
  en:{title:'Network Map',subtitle:'🗺️ Map peer connections as a spy network',disconnected:'Disconnected',connected:'Connected',mainSection:'Spy Network Graph',mainDesc:'Build and explore a force-directed network graph',sectionA:'Network Graph Theory',sectionB:'Encrypted Communication',sectionC:'Network Analysis',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Network Map?',faq_a1:'A spy network graph visualizer with force-directed layout.',faq_q2:'Is this real?',faq_a2:'No. Simulated network.',faq_q3:'How do I change the language?',faq_a3:'Open Settings.',faq_q4:'Is my data private?',faq_a4:'Yes. Local only.',howto_1:'Click Add Agent to create nodes.',howto_2:'Click Send Message to route between nodes.',howto_3:'Discover reveals hidden connections.',howto_4:'Analyze network in Section C.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🗺️ Network Map ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',addAgent:'Add Agent',sendMsg:'Send Message',discover:'Discover Node',resetBtn:'Reset',graphHint:'Click canvas to select nodes. Drag to move.',graphTheory:'Network graphs model relationships. Nodes=agents, edges=connections.',encComm:'Messages are encrypted and routed through intermediary nodes.',analysisText:'Analyze centrality, clustering, and vulnerabilities.',analyzeNetBtn:'Analyze Network',agentAdded:'Agent added',msgSent:'Message routed',discovered:'Connection discovered',networkReset:'Network reset',},
  fr:{title:'Carte Reseau',subtitle:'🗺️ Cartographier les connexions comme un reseau d\'espions',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Graphe Reseau Espion',mainDesc:'Construisez et explorez un graphe de reseau',sectionA:'Theorie des Graphes',sectionB:'Communication Chiffree',sectionC:'Analyse Reseau',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que Carte Reseau ?',faq_a1:'Un visualiseur de graphe reseau espion.',faq_q2:'C\'est reel ?',faq_a2:'Non. Reseau simule.',faq_q3:'Changer la langue ?',faq_a3:'Ouvrez Parametres.',faq_q4:'Donnees privees ?',faq_a4:'Oui. Local.',howto_1:'Cliquez Ajouter Agent.',howto_2:'Envoyez un message.',howto_3:'Decouvrez des connexions.',howto_4:'Analysez le reseau.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🗺️ Carte Reseau pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',addAgent:'Ajouter Agent',sendMsg:'Envoyer Message',discover:'Decouvrir Noeud',resetBtn:'Reset',graphHint:'Cliquez pour selectionner. Glissez pour deplacer.',graphTheory:'Les graphes modelisent les relations.',encComm:'Les messages sont chiffres et routes.',analysisText:'Analysez centralite et vulnerabilites.',analyzeNetBtn:'Analyser Reseau',agentAdded:'Agent ajoute',msgSent:'Message route',discovered:'Connexion decouverte',networkReset:'Reseau reinitialise',},
  ar:{title:'خريطة الشبكة',subtitle:'🗺️ رسم خريطة اتصالات كشبكة تجسس',disconnected:'غير متصل',connected:'متصل',mainSection:'رسم بياني لشبكة التجسس',mainDesc:'ابن واستكشف رسما بيانيا للشبكة',sectionA:'نظرية الرسوم البيانية',sectionB:'الاتصال المشفر',sectionC:'تحليل الشبكة',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هي خريطة الشبكة؟',faq_a1:'مصور رسم بياني لشبكة تجسس.',faq_q2:'هل هذا حقيقي؟',faq_a2:'لا. شبكة محاكاة.',faq_q3:'كيف اغير اللغة؟',faq_a3:'افتح الاعدادات.',faq_q4:'بياناتي خاصة؟',faq_a4:'نعم. محلي.',howto_1:'انقر اضافة عميل.',howto_2:'ارسل رسالة.',howto_3:'اكتشف اتصالات.',howto_4:'حلل الشبكة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🗺️ خريطة الشبكة جاهزة!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',addAgent:'اضافة عميل',sendMsg:'ارسال رسالة',discover:'اكتشاف عقدة',resetBtn:'اعادة',graphHint:'انقر لتحديد. اسحب للتحريك.',graphTheory:'الرسوم البيانية تمثل العلاقات.',encComm:'الرسائل مشفرة ومسارها عبر عقد وسيطة.',analysisText:'حلل المركزية والتجمع والثغرات.',analyzeNetBtn:'تحليل الشبكة',agentAdded:'تمت اضافة عميل',msgSent:'تم توجيه الرسالة',discovered:'تم اكتشاف اتصال',networkReset:'تمت اعادة تعيين الشبكة',}
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
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════ NETWORK MAP — FORCE-DIRECTED GRAPH ═══════ */

const AGENT_NAMES=['Alpha','Bravo','Charlie','Delta','Echo','Foxtrot','Golf','Hotel','India','Juliet','Kilo','Lima','Mike','November','Oscar','Papa','Quebec','Romeo','Sierra','Tango'];
const NODE_COLORS=['#ff4444','#33cc55','#4488ff','#ffaa00','#cc44ff','#00cccc','#ff6699','#88ff44'];
let nodes=[],edges=[],animFrame=null,selectedNode=null,dragging=null,msgAnim=null;

function addAgent(){
  const s=LANG[currentLang];
  const idx=nodes.length;
  if(idx>=AGENT_NAMES.length)return;
  const canvas=$('graphCanvas');if(!canvas)return;
  const w=canvas.width,h=canvas.height;
  const node={
    id:idx,name:AGENT_NAMES[idx],
    x:100+Math.random()*(w-200),y:100+Math.random()*(h-200),
    vx:0,vy:0,
    color:NODE_COLORS[idx%NODE_COLORS.length],
    radius:16+Math.random()*8
  };
  nodes.push(node);
  // Add random edges to existing nodes
  if(nodes.length>1){
    const target=nodes[Math.floor(Math.random()*(nodes.length-1))];
    edges.push({from:node.id,to:target.id,strength:0.3+Math.random()*0.7});
  }
  if(nodes.length>2&&Math.random()>0.5){
    const target=nodes[Math.floor(Math.random()*(nodes.length-1))];
    if(target.id!==node.id&&!edges.find(e=>(e.from===node.id&&e.to===target.id)||(e.from===target.id&&e.to===node.id)))
      edges.push({from:node.id,to:target.id,strength:0.2+Math.random()*0.5});
  }
  log(`➕ ${s.agentAdded}: ${node.name}`,'success');setStatus(true);
}

function discoverNode(){
  const s=LANG[currentLang];
  if(nodes.length<2)return;
  // Add a random edge between existing nodes
  let a,b,tries=0;
  do{a=Math.floor(Math.random()*nodes.length);b=Math.floor(Math.random()*nodes.length);tries++;}
  while((a===b||edges.find(e=>(e.from===a&&e.to===b)||(e.from===b&&e.to===a)))&&tries<50);
  if(a!==b&&!edges.find(e=>(e.from===a&&e.to===b)||(e.from===b&&e.to===a))){
    edges.push({from:a,to:b,strength:0.3+Math.random()*0.7});
    log(`🔍 ${s.discovered}: ${nodes[a].name} ↔ ${nodes[b].name}`,'success');
  }
}

function sendNetMessage(){
  const s=LANG[currentLang];
  if(nodes.length<2||edges.length<1)return;
  const edge=edges[Math.floor(Math.random()*edges.length)];
  edge.msgT=0;edge.msgDir=Math.random()>0.5?1:-1;
  log(`📨 ${s.msgSent}: ${nodes[edge.from].name} → ${nodes[edge.to].name}`,'tx');
}

function resetNetwork(){
  nodes=[];edges=[];selectedNode=null;
  log(`🗑️ ${LANG[currentLang].networkReset}`,'info');
}

function analyzeNetwork(){
  const results=$('netAnalysis');if(!results)return;results.style.display='block';
  if(nodes.length===0){results.textContent='No nodes in network.';return;}
  // Degree centrality
  const degrees={};nodes.forEach(n=>degrees[n.id]=0);
  edges.forEach(e=>{degrees[e.from]++;degrees[e.to]++;});
  const maxDeg=Math.max(...Object.values(degrees),1);
  const central=nodes.reduce((a,b)=>degrees[a.id]>=degrees[b.id]?a:b);
  const density=nodes.length>1?(2*edges.length/(nodes.length*(nodes.length-1))):0;
  results.innerHTML=`<div style="font-size:.8rem;"><div style="margin-bottom:.5rem;"><strong>Nodes:</strong> ${nodes.length} | <strong>Edges:</strong> ${edges.length}</div><div style="margin-bottom:.5rem;"><strong>Density:</strong> ${(density*100).toFixed(1)}%</div><div style="margin-bottom:.5rem;"><strong>Most connected:</strong> <span style="color:${central.color};">${central.name}</span> (${degrees[central.id]} connections)</div><div style="margin-bottom:.5rem;"><strong>Centrality ranking:</strong></div>${nodes.map(n=>`<div style="display:flex;align-items:center;gap:.3rem;margin:.2rem 0;"><span style="color:${n.color};font-weight:700;">${n.name}</span><div style="flex:1;height:6px;border-radius:3px;background:#1a1a2e;"><div style="height:100%;width:${degrees[n.id]/maxDeg*100}%;background:${n.color};border-radius:3px;"></div></div><span style="font-size:.7rem;">${degrees[n.id]}</span></div>`).join('')}</div>`;
  log('📊 Network analysis complete','success');
}

/* Force-directed layout */
function simulate(){
  const canvas=$('graphCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height;

  // Physics
  const repulsion=5000,spring=0.005,damping=0.85,restLen=120;
  // Repulsion between all nodes
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      let dx=nodes[j].x-nodes[i].x,dy=nodes[j].y-nodes[i].y;
      let dist=Math.sqrt(dx*dx+dy*dy)||1;
      let f=repulsion/(dist*dist);
      let fx=dx/dist*f,fy=dy/dist*f;
      nodes[i].vx-=fx;nodes[i].vy-=fy;
      nodes[j].vx+=fx;nodes[j].vy+=fy;
    }
  }
  // Spring forces along edges
  edges.forEach(e=>{
    const a=nodes[e.from],b=nodes[e.to];if(!a||!b)return;
    let dx=b.x-a.x,dy=b.y-a.y;
    let dist=Math.sqrt(dx*dx+dy*dy)||1;
    let f=(dist-restLen)*spring*e.strength;
    let fx=dx/dist*f,fy=dy/dist*f;
    a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy;
  });
  // Center gravity
  nodes.forEach(n=>{
    n.vx+=(w/2-n.x)*0.0005;n.vy+=(h/2-n.y)*0.0005;
    n.vx*=damping;n.vy*=damping;
    if(n!==dragging){n.x+=n.vx;n.y+=n.vy;}
    n.x=Math.max(n.radius,Math.min(w-n.radius,n.x));
    n.y=Math.max(n.radius,Math.min(h-n.radius,n.y));
  });

  // Draw
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#060d1a';ctx.fillRect(0,0,w,h);
  // Grid
  ctx.strokeStyle='#0a1a30';ctx.lineWidth=0.5;
  for(let i=0;i<w;i+=40){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
  for(let i=0;i<h;i+=40){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}

  // Edges
  edges.forEach(e=>{
    const a=nodes[e.from],b=nodes[e.to];if(!a||!b)return;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=`rgba(100,150,200,${0.2+e.strength*0.5})`;
    ctx.lineWidth=1+e.strength*3;ctx.stroke();
    // Message animation
    if(e.msgT!=null&&e.msgT<1){
      e.msgT+=0.02;
      const t=e.msgDir>0?e.msgT:1-e.msgT;
      const mx=a.x+(b.x-a.x)*t,my=a.y+(b.y-a.y)*t;
      ctx.beginPath();ctx.arc(mx,my,6,0,Math.PI*2);
      ctx.fillStyle='#ffcc00';ctx.fill();
      ctx.fillStyle='#000';ctx.font='8px serif';ctx.textAlign='center';ctx.fillText('📨',mx,my+3);
      if(e.msgT>=1)delete e.msgT;
    }
  });

  // Nodes
  nodes.forEach(n=>{
    // Glow
    ctx.beginPath();ctx.arc(n.x,n.y,n.radius+6,0,Math.PI*2);
    ctx.fillStyle=n.color+'22';ctx.fill();
    // Circle
    ctx.beginPath();ctx.arc(n.x,n.y,n.radius,0,Math.PI*2);
    ctx.fillStyle=n===selectedNode?n.color+'88':'#0d1522';ctx.fill();
    ctx.strokeStyle=n.color;ctx.lineWidth=n===selectedNode?3:2;ctx.stroke();
    // Label
    ctx.fillStyle='#fff';ctx.font='10px Orbitron';ctx.textAlign='center';
    ctx.fillText(n.name,n.x,n.y+3);
    ctx.fillStyle=n.color;ctx.font='7px monospace';
    ctx.fillText(`Agent-${String(n.id).padStart(2,'0')}`,n.x,n.y+n.radius+12);
  });
  ctx.textAlign='start';

  animFrame=requestAnimationFrame(simulate);
}

function initCanvasInteraction(){
  const canvas=$('graphCanvas');if(!canvas)return;
  canvas.addEventListener('mousedown',e=>{
    const rect=canvas.getBoundingClientRect();
    const sx=canvas.width/rect.width,sy=canvas.height/rect.height;
    const mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    for(const n of nodes){
      const dx=n.x-mx,dy=n.y-my;
      if(Math.sqrt(dx*dx+dy*dy)<n.radius+5){dragging=n;selectedNode=n;canvas.style.cursor='grabbing';return;}
    }
    selectedNode=null;
  });
  canvas.addEventListener('mousemove',e=>{
    if(!dragging)return;
    const rect=canvas.getBoundingClientRect();
    const sx=canvas.width/rect.width,sy=canvas.height/rect.height;
    dragging.x=(e.clientX-rect.left)*sx;dragging.y=(e.clientY-rect.top)*sy;
    dragging.vx=0;dragging.vy=0;
  });
  canvas.addEventListener('mouseup',()=>{dragging=null;canvas.style.cursor='grab';});
  canvas.addEventListener('mouseleave',()=>{dragging=null;canvas.style.cursor='grab';});
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  $('addAgentBtn')&&($('addAgentBtn').onclick=addAgent);
  $('sendMsgBtn')&&($('sendMsgBtn').onclick=sendNetMessage);
  $('discoverBtn')&&($('discoverBtn').onclick=discoverNode);
  $('resetBtn')&&($('resetBtn').onclick=resetNetwork);
  $('analyzeNetBtn')&&($('analyzeNetBtn').onclick=analyzeNetwork);
  initCanvasInteraction();

  // Seed initial agents
  for(let i=0;i<4;i++)addAgent();
  simulate();
  setStatus(true);

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Network Traffic Heatmap & Bandwidth Monitor ═══════ */
(function(){
let hCanvas,hCtx;const heatPts=[];const tHistory=[];
function createH(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Network Traffic Heatmap</div>';
  const c=document.createElement('canvas');c.width=650;c.height=220;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
function genData(){
  if(tHistory.length>120)tHistory.shift();
  tHistory.push({tx:Math.random()*80+20,rx:Math.random()*60+10});
  if(nodes.length>0){const n=nodes[Math.floor(Math.random()*nodes.length)];
    const sx=hCanvas.width/($('graphCanvas')?.width||650),sy=hCanvas.height/($('graphCanvas')?.height||400);
    heatPts.push({x:n.x*sx,y:n.y*sy,intensity:0.3+Math.random()*0.7,life:1,color:n.color});}
}
function drawH(){
  if(!hCtx)return;const w=hCanvas.width,h=hCanvas.height;
  hCtx.fillStyle='rgba(6,13,26,0.08)';hCtx.fillRect(0,0,w,h);
  hCtx.strokeStyle='rgba(100,150,200,0.04)';hCtx.lineWidth=0.5;
  for(let x=0;x<w;x+=20){hCtx.beginPath();hCtx.moveTo(x,0);hCtx.lineTo(x,h);hCtx.stroke();}
  for(let y=0;y<h;y+=20){hCtx.beginPath();hCtx.moveTo(0,y);hCtx.lineTo(w,y);hCtx.stroke();}
  for(let i=heatPts.length-1;i>=0;i--){const p=heatPts[i];p.life-=0.008;
    if(p.life<=0){heatPts.splice(i,1);continue;}
    const r=30+p.intensity*40;const gr=hCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*p.life);
    gr.addColorStop(0,(p.color||'#ff4444')+'44');gr.addColorStop(1,'transparent');
    hCtx.fillStyle=gr;hCtx.fillRect(p.x-r,p.y-r,r*2,r*2);
  }
  const gH=60,gY=h-gH-5;
  hCtx.strokeStyle='rgba(255,255,255,0.05)';hCtx.lineWidth=1;
  hCtx.beginPath();hCtx.moveTo(0,gY);hCtx.lineTo(w,gY);hCtx.stroke();
  if(tHistory.length>1){
    hCtx.beginPath();tHistory.forEach((d,i)=>{const x=w-((tHistory.length-i)*5),y=gY+gH-(d.tx/100*gH);i===0?hCtx.moveTo(x,y):hCtx.lineTo(x,y);});
    hCtx.strokeStyle='#33cc5588';hCtx.lineWidth=1.5;hCtx.stroke();
    hCtx.beginPath();tHistory.forEach((d,i)=>{const x=w-((tHistory.length-i)*5),y=gY+gH-(d.rx/100*gH);i===0?hCtx.moveTo(x,y):hCtx.lineTo(x,y);});
    hCtx.strokeStyle='#4488ff88';hCtx.lineWidth=1.5;hCtx.stroke();
  }
  hCtx.fillStyle='rgba(255,255,255,0.4)';hCtx.font='8px monospace';hCtx.textAlign='left';
  hCtx.fillText('Nodes: '+nodes.length+' | Edges: '+edges.length+' | Heat: '+heatPts.length,8,12);
  const last=tHistory.length>0?tHistory[tHistory.length-1]:null;
  if(last){hCtx.fillStyle='#33cc55';hCtx.fillText('TX: '+last.tx.toFixed(0)+' Mbps',8,gY-4);
    hCtx.fillStyle='#4488ff';hCtx.fillText('RX: '+last.rx.toFixed(0)+' Mbps',120,gY-4);}
  requestAnimationFrame(drawH);
}
function initH(){hCanvas=createH();if(!hCanvas)return;hCtx=hCanvas.getContext('2d');
  setInterval(genData,500);
  hCanvas.addEventListener('click',e=>{const rect=hCanvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(hCanvas.width/rect.width),my=(e.clientY-rect.top)*(hCanvas.height/rect.height);
    for(let i=0;i<6;i++)heatPts.push({x:mx+(Math.random()-0.5)*30,y:my+(Math.random()-0.5)*30,intensity:0.5+Math.random()*0.5,life:1,color:NODE_COLORS[Math.floor(Math.random()*NODE_COLORS.length)]});
  });drawH();}
setTimeout(initH,2000);
})();
