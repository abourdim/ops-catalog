/**
 * Sonic Voice Cloak — Workshop DIY v1.0
 * Real-time voice disguiser with pitch/effects
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, micStream, dataArray, freqArray;
let isActive = false, animId = null, distNode, gainNode, bqFilter;
const PRESETS = {
  deep: { pitch: 0.6, dist: 50, label: 'Deep Vader' },
  high: { pitch: 2.0, dist: 0, label: 'Chipmunk' },
  robot: { pitch: 1.0, dist: 200, label: 'Robot' },
  whisper: { pitch: 1.2, dist: 0, label: 'Whisper' },
  demon: { pitch: 0.4, dist: 300, label: 'Demon' }
};

const LANG = {
  en: {
    title:'Voice Cloak', subtitle:'Real-Time Voice Disguiser',
    disconnected:'Idle', connected:'Cloaked',
    mainSection:'Voice Cloak', mainDesc:'Transform your voice in real-time',
    sectionA:'Voice Presets', sectionB:'DSP Theory', sectionC:'Challenge',
    cloakBtn:'Start Cloak', stopBtn:'Stop',
    voiceLabel:'Voice:', pitchLabel:'Pitch:', distLabel:'Distortion:',
    cloakLabel:'Cloak Status', levelLabel:'Input Level', voiceInfoLabel:'Voice Info',
    inactive:'Inactive', presetHint:'Click a preset to apply it.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Voice Cloak ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    started:'Voice cloak activated — speak now', stopped:'Voice cloak deactivated',
    faq_q1:'What is Voice Cloak?', faq_a1:'A real-time voice transformer that changes your voice pitch, timbre, and adds effects to disguise your identity.',
    faq_q2:'Can it truly disguise my identity?', faq_a2:'Pitch shifting alone may not fool advanced voice biometrics, but combined with distortion it significantly alters vocal characteristics.',
    faq_q3:'Is there latency?', faq_a3:'Web Audio API processes in real-time with minimal latency (typically 10-50ms). Some effects may add slight delay.',
    faq_q4:'Is my audio private?', faq_a4:'100% local. Audio is processed entirely in your browser and never leaves your device.',
    howto_1:'Select a voice preset or adjust pitch/distortion manually.',
    howto_2:'Click Start Cloak to activate the voice transformer.',
    howto_3:'Speak into your microphone. Your transformed voice plays through speakers.',
    howto_4:'Adjust parameters in real-time to find the perfect disguise.',
    wiki_pitch_title:'Pitch Shifting', wiki_pitch:'Changes the fundamental frequency of your voice. Lower values = deeper voice, higher values = chipmunk effect.',
    wiki_dist_title:'Waveshaping Distortion', wiki_dist:'Non-linear transfer function that adds harmonics and overtones, creating robotic or demonic effects.',
    wiki_filter_title:'Biquad Filtering', wiki_filter:'Shapes frequency response. Low-pass for deep voices, high-pass for thin voices. Controls vocal timbre.',
    challenge1:'Can pitch shifting alone prevent voice identification?',
    challenge2:'What is the difference between pitch shifting and formant shifting?',
    challenge3:'Design a voice cloak that maximizes anonymity while remaining intelligible.',
    challengeReveal1:'No! Simple pitch shifting preserves formant patterns, speaking rhythm, and vocabulary. Advanced voice biometrics can reverse pitch shifts. Combine with distortion and formant shifting for better anonymity.',
    challengeReveal2:'Pitch shifting changes the fundamental frequency (how high/low). Formant shifting changes the resonance of the vocal tract (what makes male vs female). Both are needed for convincing disguise.',
    challengeReveal3:'Use moderate pitch shift (0.7-0.8x), independent formant shift, light distortion, random micro-pauses, and vocabulary substitution. Too much distortion reduces intelligibility.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  },
  fr: {
    title:'Masque Vocal', subtitle:'Deguiseur de Voix Temps Reel',
    disconnected:'Inactif', connected:'Masque',
    mainSection:'Masque Vocal', mainDesc:'Transformer votre voix en temps reel',
    sectionA:'Presets de Voix', sectionB:'Theorie DSP', sectionC:'Defi',
    cloakBtn:'Activer le Masque', stopBtn:'Arreter',
    voiceLabel:'Voix:', pitchLabel:'Hauteur:', distLabel:'Distorsion:',
    cloakLabel:'Etat du Masque', levelLabel:'Niveau d\'Entree', voiceInfoLabel:'Info Voix',
    inactive:'Inactif', presetHint:'Cliquez sur un preset pour l\'appliquer.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Masque vocal pret!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    started:'Masque vocal active — parlez maintenant', stopped:'Masque vocal desactive',
    faq_q1:'Qu\'est-ce que le Masque Vocal?', faq_a1:'Un transformateur de voix en temps reel qui modifie la hauteur, le timbre et ajoute des effets pour masquer votre identite.',
    faq_q2:'Peut-il vraiment masquer mon identite?', faq_a2:'Le changement de hauteur seul ne trompe pas la biometrie vocale avancee, mais combine avec la distorsion il modifie significativement les caracteristiques vocales.',
    faq_q3:'Y a-t-il de la latence?', faq_a3:'L\'API Web Audio traite en temps reel avec une latence minimale (10-50ms typique).',
    faq_q4:'Mon audio est-il prive?', faq_a4:'100% local. L\'audio est traite dans votre navigateur et ne quitte jamais votre appareil.',
    howto_1:'Selectionnez un preset ou ajustez manuellement.', howto_2:'Cliquez Activer le Masque.',
    howto_3:'Parlez dans votre micro. Votre voix transformee sort par les haut-parleurs.', howto_4:'Ajustez les parametres en temps reel.',
    wiki_pitch_title:'Changement de Hauteur', wiki_pitch:'Modifie la frequence fondamentale. Valeurs basses = voix grave, hautes = effet chipmunk.',
    wiki_dist_title:'Distorsion par Waveshaping', wiki_dist:'Fonction de transfert non-lineaire qui ajoute des harmoniques.',
    wiki_filter_title:'Filtrage Biquad', wiki_filter:'Modifie la reponse frequentielle. Passe-bas pour voix graves, passe-haut pour voix fines.',
    challenge1:'Le changement de hauteur seul peut-il prevenir l\'identification vocale?',
    challenge2:'Quelle est la difference entre changement de hauteur et changement de formants?',
    challenge3:'Concevez un masque vocal qui maximise l\'anonymat tout en restant intelligible.',
    challengeReveal1:'Non! Le changement de hauteur simple preserve les formants, le rythme et le vocabulaire. La biometrie avancee peut inverser ces changements.',
    challengeReveal2:'Le changement de hauteur modifie la frequence fondamentale. Le changement de formants modifie la resonance du tractus vocal (masculin vs feminin).',
    challengeReveal3:'Utilisez un changement de hauteur modere (0.7-0.8x), un changement de formants independant, une legere distorsion et des micro-pauses aleatoires.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  },
  ar: {
    title:'عباءة الصوت', subtitle:'مغير الصوت الفوري',
    disconnected:'خامل', connected:'مقنع',
    mainSection:'عباءة الصوت', mainDesc:'حوّل صوتك في الوقت الحقيقي',
    sectionA:'إعدادات الصوت المسبقة', sectionB:'نظرية DSP', sectionC:'التحدي',
    cloakBtn:'تفعيل العباءة', stopBtn:'إيقاف',
    voiceLabel:'الصوت:', pitchLabel:'الطبقة:', distLabel:'التشويه:',
    cloakLabel:'حالة العباءة', levelLabel:'مستوى الإدخال', voiceInfoLabel:'معلومات الصوت',
    inactive:'غير نشط', presetHint:'انقر على إعداد لتطبيقه.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'عباءة الصوت جاهزة!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    started:'تم تفعيل عباءة الصوت — تحدث الآن', stopped:'تم إيقاف عباءة الصوت',
    faq_q1:'ما هي عباءة الصوت؟', faq_a1:'محول صوت فوري يغير طبقة صوتك وجرسه ويضيف تأثيرات لإخفاء هويتك.',
    faq_q2:'هل يمكنها حقاً إخفاء هويتي؟', faq_a2:'تغيير الطبقة وحده قد لا يخدع القياسات الحيوية المتقدمة، لكن مع التشويه يغير الخصائص الصوتية بشكل كبير.',
    faq_q3:'هل هناك تأخير؟', faq_a3:'واجهة Web Audio تعالج في الوقت الحقيقي بتأخير ضئيل (10-50 مللي ثانية عادة).',
    faq_q4:'هل صوتي خاص؟', faq_a4:'معالجة محلية 100%. الصوت يُعالج في متصفحك ولا يغادر جهازك أبدًا.',
    howto_1:'اختر إعدادًا مسبقًا أو اضبط الطبقة والتشويه يدويًا.',
    howto_2:'انقر تفعيل العباءة لتشغيل المحول.',
    howto_3:'تحدث في الميكروفون. صوتك المحول يخرج من السماعات.',
    howto_4:'اضبط المعاملات في الوقت الحقيقي للعثور على التمويه المثالي.',
    wiki_pitch_title:'تغيير الطبقة', wiki_pitch:'يغير التردد الأساسي لصوتك. قيم أقل = صوت أعمق، أعلى = تأثير السنجاب.',
    wiki_dist_title:'تشويه بتشكيل الموجة', wiki_dist:'دالة نقل غير خطية تضيف توافقيات ونغمات فرعية لتأثيرات آلية أو شيطانية.',
    wiki_filter_title:'ترشيح Biquad', wiki_filter:'يشكل الاستجابة الترددية. تمرير منخفض للأصوات العميقة، تمرير مرتفع للأصوات الرفيعة.',
    challenge1:'هل يمكن لتغيير الطبقة وحده منع تحديد الصوت؟',
    challenge2:'ما الفرق بين تغيير الطبقة وتغيير الصيغ الصوتية؟',
    challenge3:'صمم عباءة صوت تعظم الخصوصية مع البقاء مفهومة.',
    challengeReveal1:'لا! تغيير الطبقة البسيط يحافظ على أنماط الصيغ الصوتية وإيقاع الكلام. القياسات الحيوية المتقدمة يمكنها عكس التغييرات.',
    challengeReveal2:'تغيير الطبقة يغير التردد الأساسي. تغيير الصيغ الصوتية يغير رنين المسلك الصوتي (ذكر مقابل أنثى). كلاهما ضروري.',
    challengeReveal3:'استخدم تغيير طبقة معتدل (0.7-0.8x)، تغيير صيغ صوتية مستقل، تشويه خفيف، ووقفات دقيقة عشوائية.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  }
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



function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = (s.title || '') + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(T('themeChanged') + ' ' + n, 'info'); }
let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log('Cleared'); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log('Copied!', 'success'); } catch { log('Copy failed', 'error'); } }
function showToast(m, ms = 0) { const e = $('toastIndicator'), t = $('toastMessage'); if (e && t) { t.textContent = m; e.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const e = $('toastIndicator'); if (e) e.style.display = 'none'; }
function setStatus(on) { const p = $('statusPill'), t = $('statusText'); if (t) t.textContent = on ? T('connected') : T('disconnected'); if (p) p.classList.toggle('connected', on); }
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); setTimeout(() => s.remove(), 600); }
let activeLogFilter = 'all';
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function revealChallenge(i) { const a = $('answer' + i); if (a) a.classList.toggle('visible'); }

/* ═══════ CANVAS ═══════ */
const canvas = $('voiceCanvas'), ctx = canvas ? canvas.getContext('2d') : null;

function drawVoice() {
  if (!ctx || !freqArray || !dataArray) return;
  analyser.getByteFrequencyData(freqArray); analyser.getByteTimeDomainData(dataArray);
  ctx.fillStyle = 'rgba(10,10,26,0.15)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Frequency bars with rainbow
  const barW = canvas.width / 128;
  for (let i = 0; i < 128; i++) {
    const h = freqArray[i] / 255 * canvas.height; const hue = i * 2;
    ctx.fillStyle = `hsla(${hue},80%,50%,0.7)`;
    ctx.fillRect(i * barW, canvas.height - h, barW - 1, h);
  }
  // Waveform overlay
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath();
  const sw = canvas.width / dataArray.length; let x = 0;
  for (let i = 0; i < dataArray.length; i++) { const y = dataArray[i] / 128 * canvas.height / 2; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); x += sw; }
  ctx.stroke();
  // Level meter
  let rms = 0; for (let i = 0; i < dataArray.length; i++) { const v = (dataArray[i] - 128) / 128; rms += v * v; } rms = Math.sqrt(rms / dataArray.length);
  $('levelFill').style.width = Math.min(100, rms * 500) + '%';
  // Labels
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Orbitron'; ctx.fillText('VOICE SPECTRUM', 10, 15);
  animId = requestAnimationFrame(drawVoice);
}

function drawIdle() {
  if (!ctx) return; ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0,255,170,0.15)'; ctx.font = '13px Orbitron'; ctx.textAlign = 'center';
  ctx.fillText('VOICE CLOAK — Click Start', canvas.width / 2, canvas.height / 2); ctx.textAlign = 'left';
}

/* ═══════ AUDIO PROCESSING ═══════ */
async function startCloak() {
  if (!audioCtx) audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') await audioCtx.resume();
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const src = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser(); analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.fftSize); freqArray = new Uint8Array(analyser.frequencyBinCount);
    // Distortion node
    distNode = audioCtx.createWaveShaper(); distNode.oversample = '4x';
    // Biquad filter for pitch shifting illusion
    bqFilter = audioCtx.createBiquadFilter(); bqFilter.type = 'lowpass'; bqFilter.frequency.value = 3000;
    gainNode = audioCtx.createGain(); gainNode.gain.value = 0.8;
    // Chain: src -> analyser, src -> distortion -> filter -> gain -> output
    src.connect(analyser); src.connect(distNode); distNode.connect(bqFilter); bqFilter.connect(gainNode); gainNode.connect(audioCtx.destination);
    applyVoicePreset();
    isActive = true; setStatus(true);
    $('cloakStatus').textContent = 'ACTIVE'; $('cloakStatus').style.color = '#22c55e';
    drawVoice(); log(T('started'), 'success'); showToast(T('started'), 2000);
  } catch (e) { log('Mic denied: ' + e.message, 'error'); }
}

function stopCloak() {
  isActive = false; setStatus(false);
  if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  $('cloakStatus').textContent = T('inactive'); $('cloakStatus').style.color = '';
  log(T('stopped'), 'info'); drawIdle();
}

function makeDistortionCurve(amount) {
  const n = 44100, c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = i * 2 / n - 1;
    c[i] = amount > 0 ? (3 + amount) * x * 20 * (Math.PI / 180) / (Math.PI + amount * Math.abs(x)) : x;
  }
  return c;
}

function applyVoicePreset() {
  const preset = $('voiceSelect').value;
  const p = PRESETS[preset] || PRESETS.deep;
  $('pitchRange').value = p.pitch; $('pitchVal').textContent = p.pitch.toFixed(1) + 'x';
  $('distRange').value = p.dist; $('distVal').textContent = p.dist;
  if (distNode) distNode.curve = makeDistortionCurve(p.dist);
  if (bqFilter) {
    const freq = p.pitch > 1 ? Math.min(8000, 3000 * p.pitch) : Math.max(500, 3000 * p.pitch);
    bqFilter.frequency.value = freq;
  }
  $('voiceInfo').innerHTML = 'Preset: ' + p.label + '<br>Pitch: ' + p.pitch + 'x<br>Distortion: ' + p.dist +
    '<br>Filter: ' + Math.round(bqFilter ? bqFilter.frequency.value : 0) + ' Hz';
  log('Preset: ' + p.label, 'info');
}

function fillPresets() {
  const el = $('presetList'); if (!el) return;
  Object.entries(PRESETS).forEach(([k, v]) => {
    const d = document.createElement('div');
    d.className = 'preset-card';
    d.innerHTML = '<b>' + v.label + '</b> — Pitch: ' + v.pitch + 'x, Dist: ' + v.dist;
    d.onclick = () => { $('voiceSelect').value = k; applyVoicePreset(); };
    el.appendChild(d);
  });
}

function fillDSP() {
  const el = $('dspInfo'); if (!el) return;
  el.innerHTML = '<b>Voice Transformation DSP</b><br><br>' +
    '<b>Pitch Shifting:</b> Changes the fundamental frequency. Lower pitch = deeper voice, higher = chipmunk. Real-time pitch shifting uses time-domain methods (PSOLA) or frequency-domain (phase vocoder).<br><br>' +
    '<b>Waveshaping Distortion:</b> Non-linear transfer function y = f(x) adds harmonics. Creates robotic/demonic effects. Controlled by the "amount" parameter which steepens the curve.<br><br>' +
    '<b>Biquad Filtering:</b> IIR filter that shapes frequency response. Low-pass removes high frequencies (deep voice), high-pass removes low frequencies (thin voice).<br><br>' +
    '<b>Real Applications:</b> Witness protection programs, anonymous phone tips, VoIP privacy, entertainment, voice acting, accessibility tools.<br><br>' +
    '<b>Counter-measures:</b> Advanced voice biometrics can sometimes reverse pitch shifts by analyzing formant patterns. Combining multiple effects (pitch + distortion + formant shift) provides better anonymity than any single technique.';
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(dismissSplash, 2500);
  try { const l = localStorage.getItem('wdiy-lang'); if (l) setLanguage(l); else setLanguage('en'); } catch { setLanguage('en'); }
  try { const t = localStorage.getItem('wdiy-theme'); if (t) setTheme(t); } catch {}
  $('helpBtn').onclick = () => { $('helpPanel').classList.toggle('open'); $('helpOverlay').classList.toggle('active'); };
  $('helpCloseBtn').onclick = $('helpOverlay').onclick = () => { $('helpPanel').classList.remove('open'); $('helpOverlay').classList.remove('active'); };
  $('settingsBtn').onclick = () => { $('settingsPanel').classList.toggle('open'); $('settingsOverlay').classList.toggle('active'); };
  $('settingsCloseBtn').onclick = $('settingsOverlay').onclick = () => { $('settingsPanel').classList.remove('open'); $('settingsOverlay').classList.remove('active'); };
  $('logBtn').onclick = () => $('logPanel').classList.toggle('open');
  $('logCloseBtn').onclick = () => $('logPanel').classList.remove('open');
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog;
  $('langSelect').onchange = e => setLanguage(e.target.value);
  $('themeSelect').onchange = e => setTheme(e.target.value);
  $('soundToggle').onchange = e => { soundEnabled = e.target.checked; };
  document.querySelectorAll('.help-tab').forEach(tab => { tab.onclick = () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const tgt = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (tgt) tgt.classList.add('active'); }; });
  document.querySelectorAll('.log-filter').forEach(btn => { btn.onclick = () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }; });
  $('cloakBtn').onclick = startCloak; $('stopCloakBtn').onclick = stopCloak;
  $('voiceSelect').onchange = applyVoicePreset;
  $('pitchRange').oninput = e => { $('pitchVal').textContent = parseFloat(e.target.value).toFixed(1) + 'x'; if (bqFilter) bqFilter.frequency.value = 3000 * parseFloat(e.target.value); };
  $('distRange').oninput = e => { $('distVal').textContent = e.target.value; if (distNode) distNode.curve = makeDistortionCurve(parseInt(e.target.value)); };
  drawIdle(); fillPresets(); fillDSP(); log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Voice Cloak
   Animated voice transformation pipeline with spectrum morphing,
   formant visualization, and real-time DSP chain diagram
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simVoiceCloak';let cv,cx,W,H,af=null,t=0;
  const specBars=128;const origSpec=new Float32Array(specBars);
  const cloakedSpec=new Float32Array(specBars);
  const waveHist=[];let simPitch=0.7,simDist=30,morphPhase=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#080610;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function genVoiceSpectrum(pitch,dist){
    // Simulate vocal formants with pitch adjustment
    const f1=700*pitch,f2=1200*pitch,f3=2500*pitch;
    for(let i=0;i<specBars;i++){
      const freq=i/specBars*8000;
      let val=0;
      // Formant peaks
      val+=0.8*Math.exp(-Math.pow((freq-f1)/120,2));
      val+=0.5*Math.exp(-Math.pow((freq-f2)/180,2));
      val+=0.3*Math.exp(-Math.pow((freq-f3)/250,2));
      // Harmonics from pitch
      for(let h=1;h<=8;h++){
        val+=0.15/h*Math.exp(-Math.pow((freq-150*pitch*h)/50,2));
      }
      // Noise floor
      val+=0.03+Math.random()*0.02;
      origSpec[i]=val;
      // Cloaked version: distortion adds harmonics, pitch shifts formants
      let cVal=val;
      cVal+=dist/100*0.3*Math.sin(freq*0.01+t*5);
      cVal*=(1+dist/100*0.5*Math.sin(freq*0.005));
      cloakedSpec[i]=Math.min(1,Math.max(0,cVal));
    }
  }

  function drawDSPChain(){
    const cy=20,ch=40;
    const nodes=[
      {label:'MIC',icon:'\u{1F399}',color:'#3b82f6',x:60},
      {label:'Pitch',icon:'\u{1F3B5}',color:'#f59e0b',x:200},
      {label:'Distort',icon:'\u{26A1}',color:'#ef4444',x:340},
      {label:'Filter',icon:'\u{1F50A}',color:'#8b5cf6',x:480},
      {label:'OUT',icon:'\u{1F50A}',color:'#22c55e',x:620}
    ];
    // Connection lines
    for(let i=0;i<nodes.length-1;i++){
      cx.beginPath();cx.moveTo(nodes[i].x+25,cy+ch/2);cx.lineTo(nodes[i+1].x-25,cy+ch/2);
      const pulseBright=0.15+0.1*Math.sin(t*3+i);
      cx.strokeStyle='rgba(100,200,255,'+pulseBright+')';cx.lineWidth=2;cx.stroke();
      // Signal dots flowing
      const dotPos=((t*60+i*30)%(nodes[i+1].x-nodes[i].x-50));
      cx.fillStyle='rgba(255,255,255,0.6)';cx.beginPath();
      cx.arc(nodes[i].x+25+dotPos,cy+ch/2,2,0,Math.PI*2);cx.fill();
    }
    // Nodes
    nodes.forEach(n=>{
      cx.save();cx.shadowColor=n.color;cx.shadowBlur=4;
      cx.beginPath();cx.roundRect(n.x-22,cy,44,ch,6);
      cx.fillStyle='rgba(0,0,0,0.5)';cx.fill();
      cx.strokeStyle=n.color;cx.lineWidth=1.5;cx.stroke();
      cx.shadowBlur=0;
      cx.font='12px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
      cx.fillText(n.icon,n.x,cy+ch/2-2);
      cx.font='7px monospace';cx.fillStyle=n.color;
      cx.fillText(n.label,n.x,cy+ch+10);
      cx.restore();
    });
  }

  function drawSpectrumComparison(){
    const sx=30,sy=80,sw=(W-80)/2,sh=90;
    // Original
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(sx,sy,sw,sh);
    cx.fillStyle='rgba(59,130,246,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('ORIGINAL VOICE',sx+4,sy+10);
    for(let i=0;i<specBars;i++){
      const x=sx+i/specBars*sw;
      const h2=origSpec[i]*sh*0.8;
      const hue=200+origSpec[i]*60;
      cx.fillStyle='hsla('+hue+',70%,50%,0.6)';
      cx.fillRect(x,sy+sh-h2,sw/specBars-0.5,h2);
    }
    // Cloaked
    const cx2=sx+sw+20;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(cx2,sy,sw,sh);
    cx.fillStyle='rgba(239,68,68,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('CLOAKED VOICE',cx2+4,sy+10);
    for(let i=0;i<specBars;i++){
      const x=cx2+i/specBars*sw;
      const h2=cloakedSpec[i]*sh*0.8;
      const hue=0+cloakedSpec[i]*40;
      cx.fillStyle='hsla('+hue+',70%,50%,0.6)';
      cx.fillRect(x,sy+sh-h2,sw/specBars-0.5,h2);
    }
    // Arrow between
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='16px sans-serif';cx.textAlign='center';
    cx.fillText('\u{27A1}',sx+sw+10,sy+sh/2);
  }

  function drawWaveformComparison(){
    const wy=185,wh=50,ww=(W-80)/2;
    // Original waveform
    cx.fillStyle='rgba(0,0,0,0.2)';cx.fillRect(30,wy,ww,wh);
    cx.strokeStyle='rgba(59,130,246,0.6)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<ww;i++){
      const tt=i/ww*4+t*3;
      const y=wy+wh/2+Math.sin(tt*8)*wh*0.3*Math.sin(tt);
      if(i===0)cx.moveTo(30+i,y);else cx.lineTo(30+i,y);
    }
    cx.stroke();

    // Cloaked waveform
    const cx2=50+ww;
    cx.fillStyle='rgba(0,0,0,0.2)';cx.fillRect(cx2,wy,ww,wh);
    cx.strokeStyle='rgba(239,68,68,0.6)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<ww;i++){
      const tt=i/ww*4+t*3;
      let y=wy+wh/2+Math.sin(tt*8*simPitch)*wh*0.3*Math.sin(tt*simPitch);
      // Add distortion clipping
      y+=Math.sin(tt*20)*wh*0.1*(simDist/100);
      if(i===0)cx.moveTo(cx2+i,y);else cx.lineTo(cx2+i,y);
    }
    cx.stroke();
  }

  function drawFormantMap(){
    const fx=30,fy=245,fw=W-60,fh=30;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(fx,fy,fw,fh);
    // Formant positions
    const formants=[
      {label:'F1',origHz:700,cloakHz:700*simPitch,color:'#f59e0b'},
      {label:'F2',origHz:1200,cloakHz:1200*simPitch,color:'#8b5cf6'},
      {label:'F3',origHz:2500,cloakHz:2500*simPitch,color:'#ec4899'}
    ];
    formants.forEach(f=>{
      // Original position
      const ox=fx+(f.origHz/4000)*fw;
      cx.fillStyle=f.color+'44';cx.beginPath();cx.arc(ox,fy+fh/2,6,0,Math.PI*2);cx.fill();
      cx.strokeStyle=f.color;cx.lineWidth=1;cx.setLineDash([2,2]);cx.stroke();cx.setLineDash([]);
      // Cloaked position
      const mx=fx+(f.cloakHz/4000)*fw;
      cx.fillStyle=f.color;cx.beginPath();cx.arc(mx,fy+fh/2,5,0,Math.PI*2);cx.fill();
      cx.font='6px monospace';cx.fillStyle=f.color;cx.textAlign='center';
      cx.fillText(f.label,mx,fy+fh/2-9);
    });
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('FORMANT SHIFT MAP — 0 Hz',fx+4,fy-3);
    cx.textAlign='right';cx.fillText('4000 Hz',fx+fw-4,fy-3);cx.textAlign='left';
  }

  function drawPresetIndicator(){
    const px=W-160,py=245,pw=140,ph=30;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(px,py,pw,ph);
    cx.strokeStyle='rgba(255,255,255,0.1)';cx.strokeRect(px,py,pw,ph);
    cx.fillStyle='rgba(255,255,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('Pitch: '+simPitch.toFixed(1)+'x',px+8,py+12);
    cx.fillText('Distortion: '+simDist,px+8,py+24);
    // Cycle presets slowly
    if(Math.floor(t)%8===0&&Math.floor(t)!==Math.floor(t-0.016)){
      const pitches=[0.5,0.7,0.85,1.3,1.6,2.0];
      const dists=[0,20,40,60,80,100];
      const idx=Math.floor(Math.random()*pitches.length);
      simPitch=pitches[idx];simDist=dists[idx];
    }
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,190,56);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,190,56);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('\u{1F399} VOICE CLOAK DSP',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Chain: Mic > Pitch > Dist > Filter > Out',16,40);
    cx.fillText('Latency: ~25ms  Quality: 16-bit/44.1kHz',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(8,6,16,0.15)';cx.fillRect(0,0,W,H);

    genVoiceSpectrum(simPitch,simDist);
    drawDSPChain();
    drawSpectrumComparison();
    drawWaveformComparison();
    drawFormantMap();
    drawPresetIndicator();
    drawHUD();

    cx.fillStyle='rgba(100,200,255,0.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Voice Transformation Pipeline — Real-Time DSP Simulation',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
