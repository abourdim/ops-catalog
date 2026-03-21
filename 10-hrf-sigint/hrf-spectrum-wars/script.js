/**
 * Spectrum Wars — Frequency Battle
 * Workshop DIY — v1.2
 * Two players fight over frequency bands
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9zM208.4,151.3h-6.5v3.2h6.5v-3.2zm-13,16.2h-3.2V151.3h3.2v16.2zm19.5,0h-3.2V151.3h3.2v16.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8V164.1l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9V152.7h-3.9v-4.7h14.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);break;case'success':osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);break;case'error':osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);break;}}

const LANG={en:{title:'Spectrum Wars',subtitle:'Spectrum Wars \u2014 Frequency Battle',disconnected:'Idle',connected:'Battle!',mainSection:'Spectrum Wars',mainDesc:'Two players fight over bands',sectionA:'Battle History',sectionB:'Spectrum Strategy Guide',sectionC:'Spectrum Allocation',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'\u2699\uFE0F Settings',language:'Language',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Spectrum Wars?',faq_a1:'A game where two players compete for frequency bands.',faq_q2:'How do I win?',faq_a2:'Control more bandwidth by placing transmissions and jamming.',faq_q3:'What is jamming?',faq_a3:'Transmitting noise on an opponent frequency.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Click New Game.',howto_2:'Click spectrum to place TX.',howto_3:'Use Jam to disrupt.',howto_4:'End Turn for AI.',wiki_ew_title:'Electronic Warfare',wiki_ew:'Using EM energy to control spectrum.',wiki_sa_title:'Spectrum Allocation',wiki_sa:'Governments allocate bands for different services.',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\uD83D\uDE80 Spectrum Wars ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',filterAll:'All',soundEffects:'Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',splashHint:'tap to skip',langChanged:'\uD83C\uDF10 Language \u2192 English',themeChanged:'\uD83C\uDFA8 Theme \u2192',player1:'Player 1',player2:'Player 2 (AI)',roundLabel:'Round',newGame:'New Game',placeTx:'Place TX',jam:'Jam',endTurn:'End Turn',bandwidth:'Bandwidth Control',battleHint:'Place transmissions and jam opponents!',guideTitle:'Spectrum Strategy',guideP1:'Place wide transmissions for more bandwidth points.',guideP2:'Jam opponent signals near their strongest transmissions.',guideP3:'Balance offense (jamming) with defense (spreading signals).',dbTitle:'Spectrum Allocation Basics',p1turn:'Player 1 Turn',p2turn:'AI Turn...',gameOver:'Game Over!',p1wins:'Player 1 Wins!',p2wins:'Player 2 Wins!',tie:'Tie!'},
fr:{title:'Guerre du Spectre',subtitle:'Guerre du Spectre \u2014 Bataille',disconnected:'En attente',connected:'Bataille !',mainSection:'Guerre du Spectre',mainDesc:'Deux joueurs combattent pour les bandes',sectionA:'Historique',sectionB:'Guide Strat\u00e9gie',sectionC:'Allocation du Spectre',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Th\u00e8me',settings:'\u2699\uFE0F Param\u00e8tres',language:'Langue',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que Guerre du Spectre ?',faq_a1:'Un jeu de comp\u00e9tition pour les fr\u00e9quences.',faq_q2:'Comment gagner ?',faq_a2:'Contr\u00f4lez plus de bande passante.',faq_q3:'Qu\'est-ce que le brouillage ?',faq_a3:'Transmettre du bruit sur les fr\u00e9quences adverses.',faq_q4:'Priv\u00e9 ?',faq_a4:'Oui.',howto_1:'Cliquez Nouvelle Partie.',howto_2:'Cliquez pour placer.',howto_3:'Brouillez l\'adversaire.',howto_4:'Fin de tour pour l\'IA.',wiki_ew_title:'Guerre \u00c9lectronique',wiki_ew:'Utiliser l\'\u00e9nergie EM.',wiki_sa_title:'Allocation',wiki_sa:'Les gouvernements allouent les bandes.',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\uD83D\uDE80 Guerre du Spectre pr\u00eate !',logCleared:'Effac\u00e9',copied:'Copi\u00e9 !',copyFail:'\u00c9chec',filterAll:'Tout',soundEffects:'Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',splashHint:'appuyer',langChanged:'\uD83C\uDF10 Fran\u00e7ais',themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',player1:'Joueur 1',player2:'Joueur 2 (IA)',roundLabel:'Tour',newGame:'Nouvelle Partie',placeTx:'Placer TX',jam:'Brouiller',endTurn:'Fin Tour',bandwidth:'Bande Passante',battleHint:'Placez et brouillez !',guideTitle:'Strat\u00e9gie',guideP1:'Placez large pour plus de points.',guideP2:'Brouillez pr\u00e8s des \u00e9missions fortes.',guideP3:'\u00c9quilibrez attaque et d\u00e9fense.',dbTitle:'Bases d\'Allocation',p1turn:'Tour Joueur 1',p2turn:'Tour IA...',gameOver:'Fin de Partie !',p1wins:'Joueur 1 Gagne !',p2wins:'Joueur 2 Gagne !',tie:'\u00c9galit\u00e9 !'},
ar:{title:'\u062D\u0631\u0628 \u0627\u0644\u0637\u064A\u0641',subtitle:'\u062D\u0631\u0628 \u0627\u0644\u0637\u064A\u0641 \u2014 \u0645\u0639\u0631\u0643\u0629 \u0627\u0644\u062A\u0631\u062F\u062F',disconnected:'\u062E\u0627\u0645\u0644',connected:'\u0645\u0639\u0631\u0643\u0629!',mainSection:'\u062D\u0631\u0628 \u0627\u0644\u0637\u064A\u0641',mainDesc:'\u0644\u0627\u0639\u0628\u0627\u0646 \u064A\u062A\u0642\u0627\u062A\u0644\u0627\u0646',sectionA:'\u0633\u062C\u0644 \u0627\u0644\u0645\u0639\u0631\u0643\u0629',sectionB:'\u062F\u0644\u064A\u0644 \u0627\u0644\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0629',sectionC:'\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0637\u064A\u0641',activityLog:'\u0633\u062C\u0644',eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B',clear:'\u0645\u0633\u062D',copy:'\u0646\u0633\u062E',export:'\u062A\u0635\u062F\u064A\u0631',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u2699\uFE0F \u0625\u0639\u062F\u0627\u062F\u0627\u062A',language:'\u0627\u0644\u0644\u063A\u0629',help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064A\u0641',wiki:'\u0648\u064A\u0643\u064A',faq_q1:'\u0645\u0627 \u0647\u064A \u062D\u0631\u0628 \u0627\u0644\u0637\u064A\u0641\u061F',faq_a1:'\u0644\u0639\u0628\u0629 \u0645\u0646\u0627\u0641\u0633\u0629 \u0639\u0644\u0649 \u0627\u0644\u062A\u0631\u062F\u062F\u0627\u062A.',faq_q2:'\u0643\u064A\u0641 \u0623\u0641\u0648\u0632\u061F',faq_a2:'\u062A\u062D\u0643\u0645 \u0628\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0646\u0637\u0627\u0642.',faq_q3:'\u0645\u0627 \u0647\u0648 \u0627\u0644\u062A\u0634\u0648\u064A\u0634\u061F',faq_a3:'\u0625\u0631\u0633\u0627\u0644 \u0636\u0648\u0636\u0627\u0621 \u0639\u0644\u0649 \u062A\u0631\u062F\u062F \u0627\u0644\u062E\u0635\u0645.',faq_q4:'\u062E\u0627\u0635\u061F',faq_a4:'\u0646\u0639\u0645.',howto_1:'\u0627\u0646\u0642\u0631 \u0644\u0639\u0628\u0629 \u062C\u062F\u064A\u062F\u0629.',howto_2:'\u0627\u0646\u0642\u0631 \u0644\u0644\u0648\u0636\u0639.',howto_3:'\u0634\u0648\u0651\u0634.',howto_4:'\u0627\u0646\u0647\u0650 \u0627\u0644\u062F\u0648\u0631.',wiki_ew_title:'\u0627\u0644\u062D\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629',wiki_ew:'\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0643\u0647\u0631\u0648\u0645\u063A\u0646\u0627\u0637\u064A\u0633\u064A\u0629.',wiki_sa_title:'\u062A\u062E\u0635\u064A\u0635',wiki_sa:'\u0627\u0644\u062D\u0643\u0648\u0645\u0627\u062A \u062A\u062E\u0635\u0635 \u0627\u0644\u0646\u0637\u0627\u0642\u0627\u062A.',working:'\u062C\u0627\u0631\u064D\u2026',t_mosque:'\u0645\u0633\u062C\u062F',t_zellige:'\u0632\u0644\u064A\u062C',t_andalus:'\u0623\u0646\u062F\u0644\u0633',t_riad:'\u0631\u064A\u0627\u0636',t_medina:'\u0645\u062F\u064A\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062F\u063A\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062A',ready:'\uD83D\uDE80 \u062D\u0631\u0628 \u0627\u0644\u0637\u064A\u0641 \u062C\u0627\u0647\u0632\u0629!',logCleared:'\u062A\u0645 \u0627\u0644\u0645\u0633\u062D',copied:'\u062A\u0645!',copyFail:'\u0641\u0634\u0644',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A',breathingGuide:'\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063A\u0637',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\uD83C\uDF10 \u0627\u0644\u0639\u0631\u0628\u064A\u0629',themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',player1:'\u0644\u0627\u0639\u0628 1',player2:'\u0644\u0627\u0639\u0628 2 (AI)',roundLabel:'\u062C\u0648\u0644\u0629',newGame:'\u0644\u0639\u0628\u0629 \u062C\u062F\u064A\u062F\u0629',placeTx:'\u0648\u0636\u0639 TX',jam:'\u062A\u0634\u0648\u064A\u0634',endTurn:'\u0627\u0646\u0647\u0627\u0621 \u0627\u0644\u062F\u0648\u0631',bandwidth:'\u0627\u0644\u0646\u0637\u0627\u0642',battleHint:'\u0636\u0639 \u0648\u0634\u0648\u0651\u0634!',guideTitle:'\u0627\u0644\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0629',guideP1:'\u0636\u0639 \u0625\u0634\u0627\u0631\u0627\u062A \u0648\u0627\u0633\u0639\u0629.',guideP2:'\u0634\u0648\u0651\u0634 \u0642\u0631\u0628 \u0625\u0634\u0627\u0631\u0627\u062A \u0627\u0644\u062E\u0635\u0645.',guideP3:'\u0648\u0627\u0632\u0646 \u0628\u064A\u0646 \u0627\u0644\u0647\u062C\u0648\u0645 \u0648\u0627\u0644\u062F\u0641\u0627\u0639.',dbTitle:'\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u0627\u0644\u062A\u062E\u0635\u064A\u0635',p1turn:'\u062F\u0648\u0631 \u0644\u0627\u0639\u0628 1',p2turn:'\u062F\u0648\u0631 AI...',gameOver:'\u0627\u0646\u062A\u0647\u062A!',p1wins:'\u0644\u0627\u0639\u0628 1 \u0641\u0627\u0632!',p2wins:'\u0644\u0627\u0639\u0628 2 \u0641\u0627\u0632!',tie:'\u062A\u0639\u0627\u062F\u0644!'}};

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



let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');buildGuide();buildDatabase();}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;document.body.style.cursor='col-resize';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=startX-e.clientX;const nw=Math.max(200,Math.min(startW+dx,window.innerWidth*0.6));document.documentElement.style.setProperty('--log-width',nw+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════════════════════════════════════════════════════════════
   APP-SPECIFIC: SPECTRUM WARS
   ═══════════════════════════════════════════════════════════════ */
let canvas,ctx,cW=780,cH=250;
const BANDS=20;const MAX_ROUNDS=10;
let p1Signals=[],p2Signals=[],p1Jams=[],p2Jams=[];
let round=0,p1Score=0,p2Score=0,gameActive=false,playerTurn=true;
let actionMode='place';let history=[];

function drawSpectrum(){
  if(!ctx)return;ctx.fillStyle='#000';ctx.fillRect(0,0,cW,cH);
  const bandW=cW/BANDS;const midY=cH/2;
  // Grid
  ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
  for(let i=0;i<=BANDS;i++){ctx.beginPath();ctx.moveTo(i*bandW,0);ctx.lineTo(i*bandW,cH);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(0,midY);ctx.lineTo(cW,midY);ctx.stroke();
  // Labels
  ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px sans-serif';ctx.textAlign='center';
  ctx.fillText('P1',15,15);ctx.fillText('P2',15,cH-8);
  for(let i=0;i<BANDS;i++){ctx.fillText((i*100)+'',i*bandW+bandW/2,midY+10);}
  // P1 signals (top half)
  p1Signals.forEach(s=>{
    const jammed=p2Jams.includes(s.band);
    ctx.fillStyle=jammed?'rgba(59,130,246,0.2)':'rgba(59,130,246,0.6)';
    const h=(s.power/100)*(midY-10);
    ctx.fillRect(s.band*bandW+2,midY-h-2,bandW-4,h);
    if(jammed){ctx.strokeStyle='#ef4444';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.band*bandW+4,midY-h);ctx.lineTo(s.band*bandW+bandW-4,midY-4);ctx.stroke();ctx.beginPath();ctx.moveTo(s.band*bandW+bandW-4,midY-h);ctx.lineTo(s.band*bandW+4,midY-4);ctx.stroke();}
  });
  // P2 signals (bottom half)
  p2Signals.forEach(s=>{
    const jammed=p1Jams.includes(s.band);
    ctx.fillStyle=jammed?'rgba(239,68,68,0.2)':'rgba(239,68,68,0.6)';
    const h=(s.power/100)*(midY-10);
    ctx.fillRect(s.band*bandW+2,midY+2,bandW-4,h);
    if(jammed){ctx.strokeStyle='#3b82f6';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.band*bandW+4,midY+4);ctx.lineTo(s.band*bandW+bandW-4,midY+h);ctx.stroke();ctx.beginPath();ctx.moveTo(s.band*bandW+bandW-4,midY+4);ctx.lineTo(s.band*bandW+4,midY+h);ctx.stroke();}
  });
  // Noise floor
  ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;ctx.beginPath();
  for(let x=0;x<cW;x++){ctx.lineTo(x,midY-10+Math.random()*20);}ctx.stroke();
}

function calcScores(){
  let s1=0,s2=0;
  p1Signals.forEach(s=>{if(!p2Jams.includes(s.band))s1+=s.power;});
  p2Signals.forEach(s=>{if(!p1Jams.includes(s.band))s2+=s.power;});
  p1Score=s1;p2Score=s2;
  $('p1Score').textContent=s1;$('p2Score').textContent=s2;
  const total=s1+s2||1;
  $('bwP1').style.width=(s1/total*100)+'%';$('bwP2').style.width=(s2/total*100)+'%';
}

function canvasClick(e){
  if(!gameActive||!playerTurn)return;
  const rect=canvas.getBoundingClientRect();const x=(e.clientX-rect.left)*(cW/rect.width);
  const band=Math.floor(x/(cW/BANDS));if(band<0||band>=BANDS)return;
  if(actionMode==='place'){
    if(p1Signals.find(s=>s.band===band)){log('Band already occupied!','error');return;}
    const power=50+Math.floor(Math.random()*50);
    p1Signals.push({band,power});
    log(`P1 placed TX at band ${band} (power: ${power})`,'tx');
    addHistory('P1','TX',band);
  }else{
    if(!p2Signals.find(s=>s.band===band)){log('No enemy signal on this band!','error');return;}
    if(p1Jams.includes(band)){log('Already jamming this band!','error');return;}
    p1Jams.push(band);
    log(`P1 jammed band ${band}`,'tx');
    addHistory('P1','JAM',band);
  }
  calcScores();drawSpectrum();
}

function aiTurn(){
  const s=LANG[currentLang];$('turnIndicator').textContent=s.p2turn;
  setTimeout(()=>{
    // AI: 60% place, 40% jam
    if(Math.random()<0.6||p1Signals.length===0){
      let band;do{band=Math.floor(Math.random()*BANDS);}while(p2Signals.find(s=>s.band===band));
      const power=40+Math.floor(Math.random()*60);
      p2Signals.push({band,power});
      log(`P2 (AI) placed TX at band ${band} (power: ${power})`,'rx');
      addHistory('P2','TX',band);
    }else{
      const targets=p1Signals.filter(s=>!p2Jams.includes(s.band));
      if(targets.length>0){
        const target=targets[Math.floor(Math.random()*targets.length)];
        p2Jams.push(target.band);
        log(`P2 (AI) jammed band ${target.band}`,'rx');
        addHistory('P2','JAM',target.band);
      }
    }
    calcScores();drawSpectrum();
    round++;$('roundDisplay').textContent=`${round}/${MAX_ROUNDS}`;
    if(round>=MAX_ROUNDS){endGame();return;}
    playerTurn=true;$('turnIndicator').textContent=s.p1turn;
  },800);
}

function endTurn(){if(!gameActive||!playerTurn)return;playerTurn=false;aiTurn();}

function endGame(){
  gameActive=false;setStatus(false);const s=LANG[currentLang];
  let result;if(p1Score>p2Score)result=s.p1wins;else if(p2Score>p1Score)result=s.p2wins;else result=s.tie;
  log(`${s.gameOver} ${result} (P1:${p1Score} vs P2:${p2Score})`,'success');
  $('turnIndicator').textContent=`${s.gameOver} ${result}`;
}

function newGame(){
  p1Signals=[];p2Signals=[];p1Jams=[];p2Jams=[];
  round=0;p1Score=0;p2Score=0;gameActive=true;playerTurn=true;history=[];
  $('p1Score').textContent='0';$('p2Score').textContent='0';$('roundDisplay').textContent='0/'+MAX_ROUNDS;
  const s=LANG[currentLang];$('turnIndicator').textContent=s.p1turn;
  setStatus(true);calcScores();drawSpectrum();updateHistory();
  log('New game started!','success');
}

function addHistory(player,action,band){
  history.unshift({player,action,band,time:new Date().toLocaleTimeString()});
  updateHistory();
}
function updateHistory(){
  const el=$('battleHistory');if(!el)return;el.innerHTML='';
  history.slice(0,20).forEach(h=>{
    const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);';
    const c=h.player==='P1'?'#3b82f6':'#ef4444';
    row.innerHTML=`<span style="color:${c};font-weight:bold;font-size:.75rem;min-width:24px;">${h.player}</span><span style="font-size:.75rem;color:var(--accent);">${h.action}</span><span style="flex:1;font-size:.72rem;">Band ${h.band}</span><span style="font-size:.6rem;color:var(--text-muted);">${h.time}</span>`;
    el.appendChild(row);
  });
}

function buildGuide(){const el=$('strategyGuide');if(!el)return;const s=LANG[currentLang];el.innerHTML=`<strong>${s.guideTitle}</strong><br><br>${s.guideP1}<br><br>${s.guideP2}<br><br>${s.guideP3}`;}
function buildDatabase(){const el=$('spectrumDB');if(!el)return;const s=LANG[currentLang];
  const allocs=[{band:'VHF',range:'30-300 MHz',use:'FM radio, TV, aviation'},{band:'UHF',range:'300-3000 MHz',use:'TV, cellular, WiFi, Bluetooth'},{band:'SHF',range:'3-30 GHz',use:'Satellite, radar, 5G'},{band:'ISM',range:'Various',use:'Unlicensed: 433, 868, 915 MHz, 2.4/5 GHz'},{band:'Military',range:'Classified',use:'Tactical comms, radar, EW'},{band:'Amateur',range:'Various',use:'Licensed hobby: HF, VHF, UHF bands'}];
  let html=`<strong>${s.dbTitle}</strong><br><br><div style="display:grid;grid-template-columns:1fr 1fr 2fr;gap:4px 8px;"><strong style="font-size:.7rem;">Band</strong><strong style="font-size:.7rem;">Range</strong><strong style="font-size:.7rem;">Use</strong>`;
  allocs.forEach(a=>{html+=`<span style="color:var(--accent);">${a.band}</span><span>${a.range}</span><span style="color:var(--text-muted);">${a.use}</span>`;});
  html+='</div>';el.innerHTML=html;}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  canvas=$('spectrumCanvas');if(canvas){ctx=canvas.getContext('2d');cW=canvas.width;cH=canvas.height;canvas.addEventListener('click',canvasClick);}
  $('newGameBtn').onclick=newGame;
  $('placeBtn').onclick=()=>{actionMode='place';$('placeBtn').classList.add('primary');$('jamBtn').classList.remove('primary');};
  $('jamBtn').onclick=()=>{actionMode='jam';$('jamBtn').classList.add('primary');$('placeBtn').classList.remove('primary');};
  $('endTurnBtn').onclick=endTurn;
  buildGuide();buildDatabase();drawSpectrum();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Spectrum Wars
   Animated battle radar + EW jamming visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const sparks=[];
function boot(){
  let el=document.getElementById('warSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='warSimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#0a0408;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='rgba(10,4,8,.15)';cx.fillRect(0,0,W,H);
  // Radar sweep left (P1)
  const r1x=100,r1y=H/2,r1r=70;
  cx.strokeStyle='rgba(59,130,246,.15)';cx.beginPath();cx.arc(r1x,r1y,r1r,0,Math.PI*2);cx.stroke();
  const a1=t*2;cx.strokeStyle='rgba(59,130,246,.5)';cx.lineWidth=2;
  cx.beginPath();cx.moveTo(r1x,r1y);cx.lineTo(r1x+Math.cos(a1)*r1r,r1y+Math.sin(a1)*r1r);cx.stroke();
  for(let i=0;i<5;i++){cx.strokeStyle=`rgba(59,130,246,${.3-i*.06})`;cx.beginPath();cx.moveTo(r1x,r1y);
  cx.lineTo(r1x+Math.cos(a1-i*.12)*r1r,r1y+Math.sin(a1-i*.12)*r1r);cx.stroke();}
  // Radar sweep right (P2)
  const r2x=W-100,r2y=H/2,r2r=70;
  cx.strokeStyle='rgba(239,68,68,.15)';cx.beginPath();cx.arc(r2x,r2y,r2r,0,Math.PI*2);cx.stroke();
  const a2=-t*1.8;cx.strokeStyle='rgba(239,68,68,.5)';cx.lineWidth=2;
  cx.beginPath();cx.moveTo(r2x,r2y);cx.lineTo(r2x+Math.cos(a2)*r2r,r2y+Math.sin(a2)*r2r);cx.stroke();
  // Jamming bolts between radars
  if(Math.random()<.08)sparks.push({x:r1x+r1r+20,y:H/2+(Math.random()-.5)*60,vx:4+Math.random()*3,life:1,color:Math.random()>.5?'#3b82f6':'#ef4444'});
  for(let i=sparks.length-1;i>=0;i--){
    const s=sparks[i];s.x+=s.vx;s.life-=.03;
    if(s.life<=0||s.x>r2x-r2r){sparks.splice(i,1);continue;}
    cx.fillStyle=s.color.slice(0,7);cx.globalAlpha=s.life;
    cx.fillRect(s.x-1,s.y-1,3+Math.random()*4,2);cx.globalAlpha=1;
  }
  // Score display in center
  const s1=typeof p1Score!=='undefined'?p1Score:0,s2=typeof p2Score!=='undefined'?p2Score:0;
  cx.fillStyle='rgba(0,0,0,.5)';cx.fillRect(W/2-60,H/2-14,120,28);
  cx.fillStyle='#3b82f6';cx.font='12px Orbitron,monospace';cx.textAlign='right';cx.fillText(s1,W/2-8,H/2+4);
  cx.fillStyle='rgba(255,255,255,.3)';cx.textAlign='center';cx.fillText('vs',W/2,H/2+4);
  cx.fillStyle='#ef4444';cx.textAlign='left';cx.fillText(s2,W/2+12,H/2+4);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Electronic Warfare — Spectrum Battle Radar',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
