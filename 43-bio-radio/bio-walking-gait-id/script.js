/** Workshop DIY — Bio Walking Gait ID v1.0 — WiFi CSI identifies people by walking pattern */
const LANG={en:{title:'Bio Walking Gait ID',subtitle:'WiFi CSI identifies people by walk',disconnected:'Disconnected',connected:'Connected',mainSection:'Gait ID \u2014 WiFi Person Identification',mainDesc:'WiFi channel state information identifies people by walking pattern',ready:'\ud83d\udeb6 Gait ID ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Bio Identification Marche',subtitle:'WiFi CSI identifie par la d\u00e9marche',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',ready:'\ud83d\udeb6 ID marche pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'\u062a\u0639\u0631\u064a\u0641 \u0627\u0644\u0645\u0634\u064a',subtitle:'WiFi CSI \u064a\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0634\u062e\u0627\u0635 \u0628\u0627\u0644\u0645\u0634\u064a',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',ready:'\ud83d\udeb6 \u062a\u0639\u0631\u064a\u0641 \u0627\u0644\u0645\u0634\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}};

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


let scanning=false,walkers=[{name:'Alice',color:'#33ff33',stride:0.7,speed:1.2,phase:0},{name:'Bob',color:'#ff6633',stride:0.9,speed:0.9,phase:Math.PI},{name:'Charlie',color:'#6699ff',stride:0.6,speed:1.5,phase:Math.PI/2}],currentWalker=0,csiData=[];
function initApp(){const canvas=$('gaitCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;const W=canvas.width,H=canvas.height;let t=0;
function frame(){ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t+=.016;if(scanning){const w=walkers[currentWalker];w.phase+=.016*w.speed*4;const step=Math.sin(w.phase)*w.stride;const csi=step*50+Math.sin(t*20)*5+(Math.random()-.5)*8;csiData.push(csi);if(csiData.length>W)csiData.shift();const sn=$('statPerson'),ss=$('statStride'),sp=$('statSpeed');if(sn)sn.textContent=w.name;if(ss)ss.textContent=w.stride.toFixed(2);if(sp)sp.textContent=w.speed.toFixed(1)}
if(csiData.length>1){ctx.beginPath();ctx.strokeStyle=walkers[currentWalker].color;ctx.lineWidth=2;csiData.forEach((v,i)=>{const x=i,y=H/2-v;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.stroke()}
// Walking figure
if(scanning){const w=walkers[currentWalker];const fx=W/2,fy=H*.75;const leg=Math.sin(w.phase)*15;ctx.strokeStyle=w.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(fx,fy-40,8,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(fx,fy-32);ctx.lineTo(fx,fy-10);ctx.moveTo(fx,fy-10);ctx.lineTo(fx-leg,fy+10);ctx.moveTo(fx,fy-10);ctx.lineTo(fx+leg,fy+10);ctx.moveTo(fx,fy-25);ctx.lineTo(fx-10,fy-15);ctx.moveTo(fx,fy-25);ctx.lineTo(fx+10,fy-15);ctx.stroke();ctx.fillStyle=w.color;ctx.font='12px Orbitron';ctx.textAlign='center';ctx.fillText(w.name,fx,fy+25);ctx.textAlign='left'}
// Gait signature box
ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(W-200,10,190,80);ctx.strokeStyle='rgba(255,255,255,.1)';ctx.strokeRect(W-200,10,190,80);ctx.fillStyle='#fff';ctx.font='10px Orbitron';ctx.fillText('GAIT SIGNATURE',W-190,25);walkers.forEach((w,i)=>{ctx.fillStyle=i===currentWalker?w.color:'rgba(255,255,255,.3)';ctx.fillText(`${w.name}: stride=${w.stride} spd=${w.speed}`,W-190,40+i*16)});
ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='10px Orbitron';ctx.fillText('WiFi CSI AMPLITUDE',10,20);
requestAnimationFrame(frame)}frame();
const startBtn=$('startBtn'),nextBtn=$('nextBtn'),trainBtn=$('trainBtn'),idBtn=$('idBtn');
if(startBtn)startBtn.onclick=()=>{scanning=!scanning;setStatus(scanning);log(scanning?'CSI capture started':'Stopped','info')};
if(nextBtn)nextBtn.onclick=()=>{currentWalker=(currentWalker+1)%walkers.length;csiData=[];log(`Switched to ${walkers[currentWalker].name}`,'info')};
if(trainBtn)trainBtn.onclick=()=>{log(`Training model on ${walkers[currentWalker].name}'s gait pattern (${csiData.length} samples)`,'success');showToast('Model trained!',1500)};
if(idBtn)idBtn.onclick=()=>{const w=walkers[currentWalker];const conf=Math.round(85+Math.random()*12);log(`Identified: ${w.name} (confidence: ${conf}%) stride=${w.stride}m speed=${w.speed}m/s`,'success');showToast(`Person: ${w.name} (${conf}%)`,2000)}}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ GAIT ID CANVAS VISUALIZATION (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootGaitViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(0,255,120,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=500;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- data stores --- */
    var csiHistory=[],gaitPatterns=[],particles=[],floorGrid=[];
    var NUM_WALKERS=4;
    var walkerDefs=[
      {name:'Alice',color:'#33ff33',stride:0.72,speed:1.1,freq:2.3,bodyH:58,legLen:30},
      {name:'Bob',color:'#ff6633',stride:0.95,speed:0.85,freq:1.7,bodyH:66,legLen:35},
      {name:'Charlie',color:'#6699ff',stride:0.62,speed:1.4,freq:3.0,bodyH:52,legLen:26},
      {name:'Dana',color:'#ff33cc',stride:0.80,speed:1.0,freq:2.0,bodyH:56,legLen:28}
    ];
    var activeWalker=0,phase=0,matchConf=0,identified=false;
    var csiBuffer=new Float32Array(W);
    var spectrogramRows=[];
    var MAX_SPEC_ROWS=120;

    /* --- WiFi router positions --- */
    var routers=[{x:80,y:90},{x:W-80,y:90},{x:80,y:H-60},{x:W-80,y:H-60}];

    /* --- init particles for CSI field --- */
    for(var i=0;i<60;i++){
      particles.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*0.8,vy:(Math.random()-.5)*0.8,life:Math.random(),size:1+Math.random()*2});
    }

    /* --- floor grid lines --- */
    for(var gx=0;gx<W;gx+=40)floorGrid.push({x1:gx,y1:H*0.55,x2:gx+20,y2:H*0.95});

    /* --- helper: draw stick figure --- */
    function drawWalker(cx,cy,w,ph,scale){
      var s=scale||1;
      var legSwing=Math.sin(ph)*w.legLen*s;
      var armSwing=Math.sin(ph+Math.PI)*12*s;
      var headR=7*s;
      var bodyLen=w.bodyH*s*0.4;
      ctx.strokeStyle=w.color;ctx.lineWidth=2.5*s;ctx.lineCap='round';
      // head
      ctx.beginPath();ctx.arc(cx,cy-bodyLen-headR,headR,0,Math.PI*2);ctx.stroke();
      // body
      ctx.beginPath();ctx.moveTo(cx,cy-bodyLen);ctx.lineTo(cx,cy);ctx.stroke();
      // legs
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx-legSwing,cy+w.legLen*s);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+legSwing,cy+w.legLen*s);ctx.stroke();
      // arms
      ctx.beginPath();ctx.moveTo(cx,cy-bodyLen*0.7);ctx.lineTo(cx-armSwing-10*s,cy-bodyLen*0.3);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,cy-bodyLen*0.7);ctx.lineTo(cx+armSwing+10*s,cy-bodyLen*0.3);ctx.stroke();
      // name tag
      ctx.fillStyle=w.color;ctx.font=(10*s)+'px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText(w.name,cx,cy+w.legLen*s+14*s);ctx.textAlign='left';
    }

    /* --- helper: heatmap color --- */
    function heatColor(v){
      var r=Math.min(255,Math.max(0,v*3*255))|0;
      var g=Math.min(255,Math.max(0,(v-0.3)*3*255))|0;
      var b=Math.min(255,Math.max(0,(1-v)*180))|0;
      return 'rgb('+r+','+g+','+b+')';
    }

    /* --- helper: draw WiFi rings --- */
    function drawRouter(rx,ry,strength){
      for(var r=0;r<3;r++){
        var rad=12+r*14+Math.sin(t*3+r)*4;
        ctx.beginPath();ctx.arc(rx,ry,rad,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,255,200,'+(0.15-r*0.04)*strength+')';
        ctx.lineWidth=1;ctx.stroke();
      }
      ctx.fillStyle='rgba(0,255,200,0.6)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('AP',rx-6,ry+3);
    }

    /* --- helper: generate CSI value --- */
    function genCSI(w,ph){
      var step=Math.sin(ph)*w.stride;
      var harmonic=Math.sin(ph*2)*0.3+Math.sin(ph*3)*0.15;
      var noise=(Math.random()-0.5)*0.15;
      return step+harmonic+noise;
    }

    /* --- main animation --- */
    function frame(){
      /* fade background */
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      var w=walkerDefs[activeWalker];
      phase+=0.016*w.speed*4;

      /* ---- SECTION 1: Top — CSI Waveform ---- */
      var csiVal=genCSI(w,phase);
      /* shift buffer */
      for(var i=0;i<W-1;i++)csiBuffer[i]=csiBuffer[i+1];
      csiBuffer[W-1]=csiVal;

      /* draw CSI trace */
      ctx.save();ctx.beginPath();ctx.rect(0,0,W,H*0.28);ctx.clip();
      ctx.fillStyle='rgba(6,6,16,0.35)';ctx.fillRect(0,0,W,H*0.28);
      ctx.beginPath();ctx.strokeStyle=w.color;ctx.lineWidth=1.8;
      for(var i=0;i<W;i++){
        var y=H*0.14-csiBuffer[i]*H*0.08;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      /* glow */
      ctx.strokeStyle=w.color.replace(')',',0.25)').replace('rgb','rgba');
      ctx.lineWidth=5;ctx.beginPath();
      for(var i=0;i<W;i++){
        var y=H*0.14-csiBuffer[i]*H*0.08;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      ctx.restore();

      /* labels */
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('WiFi CSI AMPLITUDE  |  CHANNEL STATE INFORMATION',10,14);
      ctx.fillText('TIME \u2192',W-60,H*0.27);

      /* ---- SECTION 2: Middle — Spectrogram ---- */
      var specY0=H*0.29,specH=H*0.22;
      /* build spectrum row from CSI */
      var specRow=[];
      for(var b=0;b<64;b++){
        var freq=b/64*w.freq*6;
        var amp=0;
        for(var h=1;h<=5;h++){
          var hf=w.freq*h;
          var diff=Math.abs(freq-hf);
          amp+=Math.exp(-diff*diff/2)/(h*0.7);
        }
        amp+=Math.random()*0.08;
        specRow.push(Math.min(1,amp*0.45));
      }
      spectrogramRows.push(specRow);
      if(spectrogramRows.length>MAX_SPEC_ROWS)spectrogramRows.shift();

      /* draw spectrogram */
      var cellW=W/64, cellH=specH/MAX_SPEC_ROWS;
      for(var row=0;row<spectrogramRows.length;row++){
        for(var col=0;col<64;col++){
          ctx.fillStyle=heatColor(spectrogramRows[row][col]);
          ctx.fillRect(col*cellW,specY0+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('GAIT SPECTROGRAM',10,specY0+12);
      ctx.fillText('FREQ \u2192',W-55,specY0+12);

      /* ---- SECTION 3: Bottom-left — Walking Scene ---- */
      var sceneX0=0,sceneY0=H*0.54,sceneW=W*0.55,sceneH=H*0.46;

      /* floor grid */
      ctx.strokeStyle='rgba(100,200,255,0.06)';ctx.lineWidth=0.5;
      for(var gx=sceneX0;gx<sceneX0+sceneW;gx+=30){
        ctx.beginPath();ctx.moveTo(gx,sceneY0+sceneH*0.3);ctx.lineTo(gx,sceneY0+sceneH);ctx.stroke();
      }
      for(var gy=sceneY0+sceneH*0.3;gy<sceneY0+sceneH;gy+=20){
        ctx.beginPath();ctx.moveTo(sceneX0,gy);ctx.lineTo(sceneX0+sceneW,gy);ctx.stroke();
      }

      /* WiFi routers in scene */
      drawRouter(sceneX0+40,sceneY0+20,0.8);
      drawRouter(sceneX0+sceneW-40,sceneY0+20,0.8);

      /* CSI field particles */
      ctx.globalAlpha=0.25;
      for(var i=0;i<particles.length;i++){
        var p=particles[i];
        p.x+=p.vx+Math.sin(t+i)*0.3;p.y+=p.vy+Math.cos(t+i*0.7)*0.2;
        if(p.x<sceneX0)p.x=sceneX0+sceneW;
        if(p.x>sceneX0+sceneW)p.x=sceneX0;
        if(p.y<sceneY0)p.y=sceneY0+sceneH;
        if(p.y>sceneY0+sceneH)p.y=sceneY0;
        p.life=0.3+Math.sin(t*2+i)*0.3;
        ctx.fillStyle=w.color;
        ctx.fillRect(p.x,p.y,p.size,p.size);
      }
      ctx.globalAlpha=1;

      /* draw active walker in center */
      var wcx=sceneX0+sceneW*0.5+Math.sin(t*w.speed)*40;
      var wcy=sceneY0+sceneH*0.6;
      drawWalker(wcx,wcy,w,phase,1.2);

      /* draw footprint trail */
      ctx.fillStyle=w.color+'22';
      for(var f=0;f<8;f++){
        var fx=wcx-80+f*22;
        var fy=wcy+w.legLen*1.2+4+Math.sin(f*Math.PI)*3;
        ctx.beginPath();ctx.ellipse(fx,fy,5,2.5,0,0,Math.PI*2);ctx.fill();
      }

      /* ---- SECTION 4: Bottom-right — Gait Signature Panel ---- */
      var panelX=W*0.57,panelY=H*0.54,panelW=W*0.42,panelH=H*0.44;
      ctx.fillStyle='rgba(0,0,0,0.45)';
      ctx.fillRect(panelX,panelY,panelW,panelH);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
      ctx.strokeRect(panelX,panelY,panelW,panelH);

      ctx.fillStyle='#fff';ctx.font='bold 10px Orbitron,monospace';
      ctx.fillText('GAIT DATABASE',panelX+10,panelY+18);

      /* walker profiles */
      for(var wi=0;wi<walkerDefs.length;wi++){
        var wd=walkerDefs[wi];
        var rowY=panelY+35+wi*42;
        var isActive=wi===activeWalker;

        /* highlight active */
        if(isActive){
          ctx.fillStyle=wd.color+'15';
          ctx.fillRect(panelX+4,rowY-10,panelW-8,38);
          ctx.strokeStyle=wd.color+'55';ctx.lineWidth=1;
          ctx.strokeRect(panelX+4,rowY-10,panelW-8,38);
        }

        /* color dot */
        ctx.fillStyle=wd.color;ctx.beginPath();ctx.arc(panelX+18,rowY+4,5,0,Math.PI*2);ctx.fill();

        /* name and stats */
        ctx.fillStyle=isActive?'#fff':'rgba(255,255,255,0.45)';ctx.font='10px Orbitron,monospace';
        ctx.fillText(wd.name,panelX+30,rowY+7);
        ctx.fillStyle=isActive?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
        ctx.fillText('stride='+wd.stride.toFixed(2)+'m  spd='+wd.speed.toFixed(1)+'m/s  f='+wd.freq.toFixed(1)+'Hz',panelX+30,rowY+20);

        /* mini gait waveform */
        ctx.beginPath();ctx.strokeStyle=isActive?wd.color:wd.color+'44';ctx.lineWidth=1;
        for(var mx=0;mx<60;mx++){
          var mv=Math.sin(mx*0.15*wd.freq)*6+Math.sin(mx*0.3*wd.freq)*2;
          var my=rowY+4+mv;
          if(mx===0)ctx.moveTo(panelX+panelW-75+mx,my);else ctx.lineTo(panelX+panelW-75+mx,my);
        }
        ctx.stroke();
      }

      /* confidence meter */
      matchConf+=(identified?95+Math.sin(t*2)*3:0-matchConf)*0.03;
      var confY=panelY+panelH-30;
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('MATCH CONFIDENCE',panelX+10,confY);
      ctx.fillStyle='rgba(255,255,255,0.08)';ctx.fillRect(panelX+140,confY-10,panelW-155,12);
      var confW=(panelW-155)*matchConf/100;
      var confColor=matchConf>80?'#33ff33':matchConf>50?'#ffcc00':'#ff3333';
      ctx.fillStyle=confColor;ctx.fillRect(panelX+140,confY-10,confW,12);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText(Math.round(matchConf)+'%',panelX+panelW-35,confY);

      /* ---- HUD elements ---- */
      /* border frame */
      ctx.strokeStyle='rgba(0,255,200,0.08)';ctx.lineWidth=1;
      ctx.strokeRect(1,1,W-2,H-2);
      /* corner decorations */
      var cl=20;ctx.strokeStyle='rgba(0,255,200,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });

      /* scanning indicator */
      ctx.fillStyle='rgba(0,255,100,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('LIVE',W-55,17);

      /* divider lines */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,H*0.28);ctx.lineTo(W,H*0.28);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,H*0.53);ctx.lineTo(W,H*0.53);ctx.stroke();
      ctx.beginPath();ctx.moveTo(W*0.56,H*0.53);ctx.lineTo(W*0.56,H);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* --- controls --- */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      /* click on walker profile to switch */
      for(var wi=0;wi<walkerDefs.length;wi++){
        var rowY=H*0.54+35+wi*42;
        if(mx>W*0.57&&mx<W&&my>rowY-10&&my<rowY+30){
          activeWalker=wi;identified=false;matchConf=0;
          spectrogramRows=[];
          break;
        }
      }
      /* click on confidence area to identify */
      if(my>H*0.54+H*0.44-35){
        identified=!identified;
      }
    });

    /* auto-cycle walkers */
    setInterval(function(){
      if(!identified){
        activeWalker=(activeWalker+1)%walkerDefs.length;
        spectrogramRows=[];
      }
    },8000);

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootGaitViz);
  else setTimeout(bootGaitViz,200);
})();
