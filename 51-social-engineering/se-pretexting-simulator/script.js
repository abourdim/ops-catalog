/**
 * SE-Pretexting-Simulator — Workshop DIY v1.0
 * Canvas-based pretexting social engineering simulation.
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';

const LANG = {
  en:{title:'Pretexting Simulator',subtitle:'Build & analyze social engineering pretexts',disconnected:'Disconnected',connected:'Connected',mainSection:'Pretexting Simulator',mainDesc:'Craft and test social engineering pretexts in a safe environment',sectionA:'How It Works',sectionB:'Challenge',buildBtn:'Build Pretext',executeBtn:'Execute Scenario',analyzeBtn:'Analyze',scenTech:'IT Support Impersonation',scenExec:'CEO Urgent Request',scenVendor:'Vendor Invoice Scam',scenHR:'HR Benefits Update',howStep1:'The attacker creates a false identity and backstory to establish trust.',howStep2:'They research the target using OSINT to make the pretext believable.',howStep3:'During interaction, they manipulate trust and authority biases.',howStep4:'The target reveals sensitive information or performs harmful actions.',challenge1:'What makes a pretext convincing?',challenge2:'How can organizations defend against pretexting?',challenge3:'Design a pretext detection checklist.',challengeReveal1:'Specific details about the target, urgency preventing verification, authority figures discouraging questioning, and emotional triggers.',challengeReveal2:'Verification procedures, employee training, callback protocols, and a culture encouraging questioning of unusual requests.',challengeReveal3:'Check: unusual urgency, caller verifiability, procedure bypasses, emotional pressure, credential requests, independent verification possibility.',revealBtn:'Reveal Answer',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',theme:'Theme',soundEffects:'🔊 Sound effects',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is pretexting?',faq_a1:'A social engineering technique using fabricated scenarios to manipulate targets.',faq_q2:'Is this real?',faq_a2:'No. Educational simulation for security awareness.',faq_q3:'What scenarios exist?',faq_a3:'IT impersonation, CEO fraud, vendor scams, and HR social engineering.',faq_q4:'How does the trust meter work?',faq_a4:'Simulates trust building based on attacker techniques and target responses.',howto_1:'Select a pretexting scenario from the dropdown.',howto_2:'Click Build Pretext to construct the narrative.',howto_3:'Click Execute to simulate the interaction.',howto_4:'Click Analyze to review attack vectors and defenses.',wiki_t1:'🕵️ Pretexting',wiki_d1:'Creating a fabricated scenario to engage a victim with a false identity.',wiki_t2:'💪 Authority Bias',wiki_d2:'Psychological tendency to obey authority figures without question.',wiki_t3:'🛡️ Defense',wiki_d3:'Multi-factor verification, callback procedures, and awareness training.',ready:'🕵️ Pretexting Simulator ready — select a scenario!',building:'Constructing pretext narrative...',built:'Pretext constructed for: %s',executing:'Executing pretexting scenario...',trustRising:'Trust level: %t% — target engaging...',executed:'Scenario complete. Trust: %t%. Compromised: %r',analyzing:'Analyzing attack vectors...',analyzed:'Analysis complete. %n vulnerabilities found.',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working...',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Simulateur de Prétexte',subtitle:'Construire et analyser des prétextes d\'ingénierie sociale',disconnected:'Déconnecté',connected:'Connecté',mainSection:'Simulateur de Prétexte',mainDesc:'Créez et testez des prétextes en toute sécurité',sectionA:'Comment ça Marche',sectionB:'Défi',buildBtn:'Construire',executeBtn:'Exécuter',analyzeBtn:'Analyser',scenTech:'Usurpation Support IT',scenExec:'Demande Urgente PDG',scenVendor:'Arnaque Facture',scenHR:'Mise à Jour RH',howStep1:'L\'attaquant crée une fausse identité pour établir la confiance.',howStep2:'Il recherche la cible avec l\'OSINT pour crédibiliser le prétexte.',howStep3:'Il manipule la confiance et les biais d\'autorité de la cible.',howStep4:'La cible révèle des informations sensibles ou agit au profit de l\'attaquant.',challenge1:'Qu\'est-ce qui rend un prétexte convaincant?',challenge2:'Comment se défendre contre le prétexte?',challenge3:'Concevez une checklist de détection.',challengeReveal1:'Détails spécifiques, urgence, figures d\'autorité et déclencheurs émotionnels.',challengeReveal2:'Procédures de vérification, formation, protocoles de rappel et culture du questionnement.',challengeReveal3:'Vérifiez: urgence inhabituelle, vérifiabilité, contournement de procédures, pression émotionnelle.',revealBtn:'Révéler',activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'⚙️ Paramètres',language:'Langue',theme:'Thème',soundEffects:'🔊 Effets sonores',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le prétexte?',faq_a1:'Technique utilisant des scénarios fabriqués pour manipuler les cibles.',faq_q2:'Est-ce réel?',faq_a2:'Non. Simulation éducative pour la sensibilisation.',faq_q3:'Quels scénarios?',faq_a3:'Usurpation IT, fraude PDG, arnaques fournisseurs et ingénierie RH.',faq_q4:'Le compteur de confiance?',faq_a4:'Simule la construction de confiance selon les techniques de l\'attaquant.',howto_1:'Sélectionnez un scénario.',howto_2:'Cliquez Construire pour créer le narratif.',howto_3:'Cliquez Exécuter pour simuler l\'interaction.',howto_4:'Cliquez Analyser pour les vecteurs d\'attaque.',wiki_t1:'🕵️ Prétexte',wiki_d1:'Créer un scénario fabriqué avec une fausse identité.',wiki_t2:'💪 Biais d\'Autorité',wiki_d2:'Tendance à obéir sans questionner.',wiki_t3:'🛡️ Défense',wiki_d3:'Vérification, rappel et formation à la sensibilisation.',ready:'🕵️ Simulateur prêt — choisissez un scénario!',building:'Construction du narratif...',built:'Prétexte construit: %s',executing:'Exécution du scénario...',trustRising:'Confiance: %t% — cible engagée...',executed:'Terminé. Confiance: %t%. Compromis: %r',analyzing:'Analyse des vecteurs...',analyzed:'Analyse terminée. %n vulnérabilités.',logCleared:'Journal effacé',copied:'Copié!',copyFail:'Échec',working:'En cours...',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'محاكي الذرائع',subtitle:'بناء وتحليل ذرائع الهندسة الاجتماعية',disconnected:'غير متصل',connected:'متصل',mainSection:'محاكي الذرائع',mainDesc:'صياغة واختبار ذرائع في بيئة آمنة',sectionA:'كيف يعمل',sectionB:'التحدي',buildBtn:'بناء الذريعة',executeBtn:'تنفيذ السيناريو',analyzeBtn:'تحليل',scenTech:'انتحال الدعم التقني',scenExec:'طلب عاجل من المدير',scenVendor:'احتيال فاتورة',scenHR:'تحديث الموارد البشرية',howStep1:'يصنع المهاجم هوية مزيفة وقصة لبناء الثقة.',howStep2:'يبحث عن الهدف باستخدام OSINT لتصديق الذريعة.',howStep3:'خلال التفاعل يتلاعب بالثقة وتحيزات السلطة.',howStep4:'يكشف الهدف معلومات حساسة أو ينفذ إجراءات ضارة.',challenge1:'ما الذي يجعل الذريعة مقنعة؟',challenge2:'كيف تدافع المؤسسات ضد التذرع؟',challenge3:'صمم قائمة تحقق لكشف الذرائع.',challengeReveal1:'تفاصيل محددة والإلحاح وشخصيات سلطوية ومحفزات عاطفية.',challengeReveal2:'إجراءات التحقق والتدريب وبروتوكولات الاتصال العكسي وثقافة التساؤل.',challengeReveal3:'تحقق: إلحاح غير عادي، قابلية التحقق، تجاوز الإجراءات، ضغط عاطفي.',revealBtn:'اكشف الإجابة',activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'⚙️ الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'🔊 المؤثرات الصوتية',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو التذرع؟',faq_a1:'تقنية تستخدم سيناريوهات مفبركة للتلاعب بالأهداف.',faq_q2:'هل هذا حقيقي؟',faq_a2:'لا. محاكاة تعليمية للتوعية الأمنية.',faq_q3:'ما السيناريوهات؟',faq_a3:'انتحال IT واحتيال المدير وأرناق الفواتير والهندسة البشرية.',faq_q4:'كيف يعمل مقياس الثقة؟',faq_a4:'يحاكي بناء الثقة وفق تقنيات المهاجم.',howto_1:'اختر سيناريو من القائمة.',howto_2:'انقر بناء لصياغة السردية.',howto_3:'انقر تنفيذ لمحاكاة التفاعل.',howto_4:'انقر تحليل لمراجعة النواقل.',wiki_t1:'🕵️ التذرع',wiki_d1:'إنشاء سيناريو مفبرك بهوية مزيفة.',wiki_t2:'💪 تحيز السلطة',wiki_d2:'ميل لطاعة السلطة دون تساؤل.',wiki_t3:'🛡️ الدفاع',wiki_d3:'التحقق والاتصال العكسي والتدريب.',ready:'🕵️ محاكي الذرائع جاهز!',building:'جارٍ بناء السردية...',built:'تم بناء الذريعة: %s',executing:'جارٍ تنفيذ السيناريو...',trustRising:'الثقة: %t% — الهدف يتفاعل...',executed:'اكتمل. الثقة: %t%. مخترق: %r',analyzing:'جارٍ تحليل النواقل...',analyzed:'اكتمل التحليل. %n ثغرات.',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',working:'جارٍ...',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
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



let currentLang='en';function T(k){return(LANG[currentLang]||LANG.en)[k]||k;}

/* ═══════ FRAMEWORK ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(T('themeChanged')+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(T('logCleared'));}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(T('copied'),'success');}catch{log(T('copyFail'),'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='pretexting-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||T('working');el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText');if(t)t.textContent=c?T('connected'):T('disconnected');const p=$('statusPill');if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open');}
function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');s&&s.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const el=$(id);if(el)el.classList.add('active');});});}
window.revealChallenge=function(i){const el=$('answer'+i);if(el)el.classList.toggle('visible');};

/* ═══════ CANVAS — Social Network Graph ═══════ */
let netAnim,trustLevel=0,scenarioActive=false;
const nodes=[],edges=[];let highlightNode=-1;
function getAccent(){return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';}

function initNetworkCanvas(){
  const c=$('networkCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  function resize(){c.width=c.offsetWidth*(window.devicePixelRatio||1);c.height=260*(window.devicePixelRatio||1);ctx.scale(window.devicePixelRatio||1,window.devicePixelRatio||1);}
  resize();window.addEventListener('resize',resize);
  const W=()=>c.width/(window.devicePixelRatio||1),H=()=>260;

  const labels=['Attacker','Target','IT Dept','CEO','HR','Finance','Vendor','Email'];
  const icons=['🕵️','👤','💻','👔','📋','💰','📦','📧'];
  for(let i=0;i<labels.length;i++){
    const a=(i/labels.length)*Math.PI*2-Math.PI/2;
    nodes.push({x:0.5+Math.cos(a)*0.35,y:0.5+Math.sin(a)*0.35,label:labels[i],icon:icons[i],pulse:0,compromised:false,vx:(Math.random()-0.5)*0.0004,vy:(Math.random()-0.5)*0.0004});
  }
  edges.push({from:0,to:1},{from:0,to:7},{from:1,to:2},{from:1,to:3},{from:1,to:4},{from:1,to:5},{from:3,to:5},{from:6,to:5},{from:7,to:1});

  let t=0;const packets=[];
  window._sendPkt=function(f,to,mal){packets.push({from:f,to:to,p:0,mal:mal||false});};

  function draw(){
    const w=W(),h=H();
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    const accent=getAccent();

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.02)';ctx.lineWidth=1;
    for(let y=0;y<h;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let x=0;x<w;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}

    nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0.1||n.x>0.9)n.vx*=-1;if(n.y<0.1||n.y>0.9)n.vy*=-1;});

    // Edges
    edges.forEach(e=>{
      const a=nodes[e.from],b=nodes[e.to];
      ctx.strokeStyle=e.active?accent:'rgba(255,255,255,0.06)';ctx.lineWidth=e.active?2:1;
      ctx.beginPath();ctx.moveTo(a.x*w,a.y*h);ctx.lineTo(b.x*w,b.y*h);ctx.stroke();
    });

    // Packets
    for(let i=packets.length-1;i>=0;i--){
      const p=packets[i];p.p+=0.02;if(p.p>1){packets.splice(i,1);continue;}
      const a=nodes[p.from],b=nodes[p.to];
      const px=a.x*w+(b.x*w-a.x*w)*p.p,py=a.y*h+(b.y*h-a.y*h)*p.p;
      ctx.fillStyle=p.mal?'#ff4444':accent;ctx.shadowColor=p.mal?'#ff4444':accent;ctx.shadowBlur=6;
      ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    }

    // Nodes
    nodes.forEach((n,i)=>{
      const nx=n.x*w,ny=n.y*h;
      if(n.pulse>0){ctx.strokeStyle=n.compromised?'rgba(255,68,68,'+n.pulse+')':'rgba(212,160,60,'+n.pulse+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(nx,ny,20+10*(1-n.pulse),0,Math.PI*2);ctx.stroke();n.pulse-=0.012;}
      ctx.fillStyle=n.compromised?'rgba(255,68,68,0.2)':i===highlightNode?'rgba(212,160,60,0.3)':'rgba(255,255,255,0.05)';
      ctx.strokeStyle=n.compromised?'#ff4444':i===highlightNode?accent:'rgba(255,255,255,0.12)';
      ctx.lineWidth=i===highlightNode?2:1;ctx.beginPath();ctx.arc(nx,ny,18,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.icon,nx,ny);
      ctx.fillStyle='rgba(255,255,255,0.45)';ctx.font='7px Orbitron,monospace';ctx.fillText(n.label,nx,ny+28);
    });

    // Trust bar
    if(scenarioActive||trustLevel>0){
      ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(10,8,w-20,10);
      ctx.fillStyle=trustLevel<30?'#44ff44':trustLevel<70?'#ffaa00':'#ff4444';
      ctx.fillRect(10,8,(w-20)*trustLevel/100,10);
      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.textAlign='left';
      ctx.fillText('TRUST: '+Math.round(trustLevel)+'%',14,16);
    }
    t++;netAnim=requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ SIMULATION ═══════ */
const SCENARIOS={tech:{name:'IT Support',steps:['Calling target as "IT Help Desk"...','Claiming urgent security patch needed...','Requesting remote access credentials...','Target provides VPN password!']},exec:{name:'CEO Fraud',steps:['Spoofing CEO email address...','Creating urgency: "Wire transfer NOW"...','Bypassing approval with authority...','Finance initiates unauthorized transfer!']},vendor:{name:'Vendor Scam',steps:['Impersonating known vendor...','Sending modified invoice with new bank...','Following up with urgency call...','Payment redirected to attacker!']},hr:{name:'HR Update',steps:['Posing as HR department...','Requesting personal info for "benefits"...','Creating fake portal...','Employee submits SSN and bank details!']}};
let currentScenario=null;

function doBuild(){
  const key=$('scenarioSelect')?$('scenarioSelect').value:'tech';
  currentScenario=SCENARIOS[key];setStatus(true);
  log(T('building'),'info');showToast(T('building'));
  nodes[0].pulse=1;highlightNode=0;
  setTimeout(()=>{hideToast();log(T('built').replace('%s',currentScenario.name),'success');
    const db=$('dialogueBox');if(db)db.textContent='[PRETEXT] Scenario: '+currentScenario.name+'\n[PRETEXT] Identity established\n[PRETEXT] Target profiled\n[PRETEXT] Backstory ready';
  },1500);
}

function doExecute(){
  if(!currentScenario){log('Build a pretext first','error');return;}
  scenarioActive=true;trustLevel=0;
  log(T('executing'),'info');showToast(T('executing'));
  const steps=currentScenario.steps;let si=0;const db=$('dialogueBox'),tm=$('trustMeter');
  const iv=setInterval(()=>{
    if(si>=steps.length){clearInterval(iv);hideToast();scenarioActive=false;
      const comp=trustLevel>60;nodes[1].compromised=comp;nodes[1].pulse=1;
      log(T('executed').replace('%t',Math.round(trustLevel)).replace('%r',comp?'YES':'NO'),'success');
      if(db)db.textContent+='\n[RESULT] Trust: '+Math.round(trustLevel)+'% | Compromised: '+(comp?'YES':'NO');return;}
    trustLevel+=15+Math.random()*12;trustLevel=Math.min(95,trustLevel);
    if(tm)tm.style.width=trustLevel+'%';
    log(T('trustRising').replace('%t',Math.round(trustLevel)),'info');
    if(db){db.textContent+='\n[STEP '+(si+1)+'] '+steps[si];db.scrollTop=db.scrollHeight;}
    _sendPkt(0,1,true);
    if(si===1)_sendPkt(0,7,true);if(si===2){_sendPkt(1,2,false);highlightNode=1;nodes[1].pulse=1;}
    if(si===3){_sendPkt(1,5,true);nodes[5].pulse=1;}
    si++;
  },2000);
}

function doAnalyze(){
  if(!currentScenario){log('Build a pretext first','error');return;}
  log(T('analyzing'),'info');showToast(T('analyzing'));
  setTimeout(()=>{hideToast();const n=3+Math.floor(Math.random()*4);
    log(T('analyzed').replace('%n',n),'success');
    const db=$('dialogueBox');
    if(db){db.textContent+='\n\n[ANALYSIS] Vulnerabilities: '+n+'\n[VULN] Authority bias — no verification\n[VULN] Urgency pressure — bypasses rational thought\n[VULN] No callback verification\n[DEFENSE] Mandatory verification for sensitive requests\n[DEFENSE] Social engineering training\n[DEFENSE] Out-of-band confirmation channels';db.scrollTop=db.scrollHeight;}
    edges.forEach(e=>e.active=false);highlightNode=-1;
  },2000);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();initHijriDate();initLogFilters();initHelpTabs();
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const ls=$('langSelect'),ts=$('themeSelect');
  if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  initNetworkCanvas();
  if($('buildBtn'))$('buildBtn').onclick=doBuild;if($('executeBtn'))$('executeBtn').onclick=doExecute;if($('analyzeBtn'))$('analyzeBtn').onclick=doAnalyze;
  log(T('ready'),'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
