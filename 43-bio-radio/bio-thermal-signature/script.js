/**
 * Workshop DIY — Bio Thermal Signature v1.0
 * Detect humans through walls via thermal RF
 */
const LANG={
  en:{title:'Bio Thermal Signature',subtitle:'See through walls with thermal RF',disconnected:'Disconnected',connected:'Connected',mainSection:'Thermal Signature \u2014 Through-Wall Detection',mainDesc:'Detect human thermal signatures through walls using RF',ready:'\ud83c\udf21 Thermal Scanner ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Bio Signature Thermique',subtitle:'Voir \u00e0 travers les murs avec RF thermique',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Signature Thermique \u2014 D\u00e9tection Murale',mainDesc:'D\u00e9tecter les signatures thermiques humaines',ready:'\ud83c\udf21 Scanner thermique pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'\u0627\u0644\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629',subtitle:'\u0631\u0624\u064a\u0629 \u0639\u0628\u0631 \u0627\u0644\u062c\u062f\u0631\u0627\u0646 \u0628\u0627\u0644\u062d\u0631\u0627\u0631\u0629 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0627\u0644\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629 \u2014 \u0643\u0634\u0641 \u0639\u0628\u0631 \u0627\u0644\u062c\u062f\u0631\u0627\u0646',mainDesc:'\u0643\u0634\u0641 \u0627\u0644\u0628\u0635\u0645\u0627\u062a \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629 \u0627\u0644\u0628\u0634\u0631\u064a\u0629',ready:'\ud83c\udf21 \u0627\u0644\u0645\u0627\u0633\u062d \u0627\u0644\u062d\u0631\u0627\u0631\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}
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



let scanning=false,showWall=true,people=[],ambientTemp=22.4;

function initApp(){
  const canvas=$('thermalCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=340;
  const W=canvas.width,H=canvas.height;let t=0;

  function addPerson(){
    people.push({x:W*.6+Math.random()*W*.3,y:H*.2+Math.random()*H*.6,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.3,temp:36.5+Math.random()*1.5,size:20+Math.random()*15});
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,20,.15)';ctx.fillRect(0,0,W,H);t+=.016;
    if(!scanning){requestAnimationFrame(frame);return}

    // Room background - thermal gradient
    for(let y=0;y<H;y+=8){for(let x=0;x<W;x+=8){
      let heat=ambientTemp+Math.sin(x*.01+t)*0.5+Math.sin(y*.01)*0.3;
      // Add heat from people
      people.forEach(p=>{
        const dx=x-p.x,dy=y-p.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<p.size*3){
          let contribution=(p.temp-ambientTemp)*Math.exp(-dist*dist/(p.size*p.size*2));
          if(showWall&&x<W*.45)contribution*=.15;// Wall attenuates
          heat+=contribution;
        }
      });
      const norm=(heat-18)/25;// Normalize 18-43C range
      const r=Math.min(255,Math.max(0,norm*512));
      const g=Math.min(255,Math.max(0,(norm-.3)*512));
      const b=Math.min(255,Math.max(0,(1-norm)*200));
      ctx.fillStyle=`rgba(${r|0},${g|0},${b|0},.8)`;
      ctx.fillRect(x,y,8,8);
    }}

    // Wall
    if(showWall){
      ctx.fillStyle='rgba(100,100,120,.6)';ctx.fillRect(W*.42,0,W*.06,H);
      ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=2;ctx.strokeRect(W*.42,0,W*.06,H);
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='bold 11px Orbitron';
      ctx.save();ctx.translate(W*.44,H/2);ctx.rotate(-Math.PI/2);ctx.fillText('WALL',0,0);ctx.restore();
    }

    // Move people
    people.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<W*.5||p.x>W-20)p.vx*=-1;
      if(p.y<20||p.y>H-20)p.vy*=-1;
      // Person marker
      ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,0,.6)';ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='9px Orbitron';
      ctx.fillText(`${p.temp.toFixed(1)}\u00b0C`,p.x+8,p.y-5);
    });

    // Sensor label
    ctx.fillStyle='rgba(0,255,150,.5)';ctx.font='10px Orbitron';ctx.fillText('SENSOR',10,20);
    ctx.fillText('TARGET ZONE',W*.6,20);

    // Update stats
    const sh=$('statHumans'),sd=$('statDist'),sc=$('statConf');
    if(sh)sh.textContent=people.length;
    if(sd)sd.textContent=(showWall?5:2).toFixed(0);
    if(sc)sc.textContent=Math.round(showWall?65+Math.random()*10:92+Math.random()*5);

    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),addBtn=$('addPersonBtn'),moveBtn=$('moveBtn'),wallBtn=$('wallBtn');
  if(startBtn)startBtn.onclick=()=>{scanning=!scanning;setStatus(scanning);log(scanning?'Thermal scan started':'Scan stopped','info')};
  if(addBtn)addBtn.onclick=()=>{addPerson();log(`Person added (total: ${people.length})`,'success');showToast(`${people.length} humans detected`,1200)};
  if(moveBtn)moveBtn.onclick=()=>{people.forEach(p=>{p.vx=(Math.random()-.5)*2;p.vy=(Math.random()-.5)*1.5});log('People moving','info')};
  if(wallBtn)wallBtn.onclick=()=>{showWall=!showWall;log(showWall?'Wall ON \u2014 signal attenuated':'Wall removed \u2014 clear view','info')};
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ THERMAL SIGNATURE CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootThermalViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,80,0,.15);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- thermal targets --- */
    var targets=[
      {x:W*0.65,y:H*0.35,vx:0.4,vy:0.2,temp:37.2,size:22,label:'Person A'},
      {x:W*0.75,y:H*0.6,vx:-0.3,vy:0.15,temp:36.8,size:18,label:'Person B'}
    ];
    var ambientT=22.0,wallX=W*0.42,wallW=W*0.05;
    var showWallV=true,scanActive=true;
    var heatMap=[];var hmW=100,hmH=65;
    var timeHistory=[];var MAX_HISTORY=200;
    var rfPulses=[];

    /* init heatmap */
    for(var i=0;i<hmW*hmH;i++)heatMap.push(ambientT);

    /* thermal palette: blue->cyan->green->yellow->red->white */
    function thermalColor(temp){
      var n=(temp-15)/30;// 15-45C range
      n=Math.max(0,Math.min(1,n));
      var r,g,b;
      if(n<0.25){r=0;g=Math.round(n*4*200);b=Math.round(150+n*4*105);}
      else if(n<0.5){var t2=(n-0.25)*4;r=Math.round(t2*200);g=200+Math.round(t2*55);b=Math.round(255-t2*200);}
      else if(n<0.75){var t2=(n-0.5)*4;r=200+Math.round(t2*55);g=Math.round(255-t2*100);b=Math.round(55-t2*55);}
      else{var t2=(n-0.75)*4;r=255;g=Math.round(155+t2*100);b=Math.round(t2*200);}
      return 'rgb('+r+','+g+','+b+')';
    }

    /* --- RF pulse for through-wall detection --- */
    function emitPulse(){
      rfPulses.push({x:30,y:H*0.38,r:0,maxR:W*0.8,speed:4,alpha:0.4});
    }

    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.15)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* ---- SECTION 1: Top — Through-wall thermal view ---- */
      var viewH=H*0.6;

      /* move targets */
      targets.forEach(function(tgt){
        tgt.x+=tgt.vx;tgt.y+=tgt.vy;
        if(tgt.x<W*0.5||tgt.x>W-25){tgt.vx*=-1;}
        if(tgt.y<30||tgt.y>viewH-25){tgt.vy*=-1;}
        tgt.temp=36.5+Math.sin(t+tgt.x*0.01)*0.8;
      });

      /* compute heatmap */
      var cellW=W/hmW,cellH=viewH/hmH;
      for(var hy=0;hy<hmH;hy++){
        for(var hx=0;hx<hmW;hx++){
          var px=hx*cellW+cellW/2,py=hy*cellH+cellH/2;
          var heat=ambientT+Math.sin(px*0.005+t)*0.3+Math.sin(py*0.007)*0.2;
          /* heat from targets */
          targets.forEach(function(tgt){
            var dx=px-tgt.x,dy=py-tgt.y;
            var dist=Math.sqrt(dx*dx+dy*dy);
            var contribution=(tgt.temp-ambientT)*Math.exp(-dist*dist/(tgt.size*tgt.size*3));
            /* wall attenuation */
            if(showWallV&&px<wallX)contribution*=0.12;
            heat+=contribution;
          });
          heatMap[hy*hmW+hx]=heat;
        }
      }

      /* draw heatmap */
      for(var hy=0;hy<hmH;hy++){
        for(var hx=0;hx<hmW;hx++){
          ctx.fillStyle=thermalColor(heatMap[hy*hmW+hx]);
          ctx.fillRect(hx*cellW,hy*cellH,cellW+0.5,cellH+0.5);
        }
      }

      /* wall */
      if(showWallV){
        ctx.fillStyle='rgba(80,80,100,0.55)';ctx.fillRect(wallX,0,wallW,viewH);
        ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.strokeRect(wallX,0,wallW,viewH);
        ctx.save();ctx.translate(wallX+wallW/2,viewH/2);ctx.rotate(-Math.PI/2);
        ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='bold 10px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText('WALL',0,0);ctx.restore();ctx.textAlign='left';
      }

      /* target markers */
      targets.forEach(function(tgt){
        ctx.strokeStyle='rgba(255,255,0,0.6)';ctx.lineWidth=1.5;
        /* crosshair */
        ctx.beginPath();ctx.moveTo(tgt.x-15,tgt.y);ctx.lineTo(tgt.x-8,tgt.y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x+8,tgt.y);ctx.lineTo(tgt.x+15,tgt.y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x,tgt.y-15);ctx.lineTo(tgt.x,tgt.y-8);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x,tgt.y+8);ctx.lineTo(tgt.x,tgt.y+15);ctx.stroke();
        /* ring */
        ctx.beginPath();ctx.arc(tgt.x,tgt.y,12,0,Math.PI*2);ctx.stroke();
        /* label */
        ctx.fillStyle='rgba(255,255,0,0.8)';ctx.font='9px Orbitron,monospace';
        ctx.fillText(tgt.label+' '+tgt.temp.toFixed(1)+'\u00b0C',tgt.x+18,tgt.y-8);
      });

      /* RF pulses */
      if(scanActive&&Math.random()<0.03)emitPulse();
      for(var pi=rfPulses.length-1;pi>=0;pi--){
        var p=rfPulses[pi];p.r+=p.speed;p.alpha-=0.004;
        if(p.alpha<=0||p.r>p.maxR){rfPulses.splice(pi,1);continue;}
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,-.4,.4);
        ctx.strokeStyle='rgba(0,255,200,'+Math.max(0,p.alpha)+')';ctx.lineWidth=1.5;ctx.stroke();
      }

      /* sensor icon */
      ctx.fillStyle='rgba(0,255,200,0.5)';ctx.font='bold 10px Orbitron,monospace';
      ctx.fillText('RF SENSOR',8,18);
      ctx.strokeStyle='rgba(0,255,200,0.4)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(25,35,8,0,Math.PI*2);ctx.stroke();
      for(var a=0;a<3;a++){
        ctx.beginPath();ctx.arc(25,35,14+a*7,-0.5,0.5);ctx.stroke();
      }

      /* temperature scale bar */
      var scaleX=W-30,scaleY=20,scaleH=viewH-40;
      for(var sy=0;sy<scaleH;sy++){
        var stmp=45-(sy/scaleH)*30;
        ctx.fillStyle=thermalColor(stmp);ctx.fillRect(scaleX,scaleY+sy,18,1);
      }
      ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.strokeRect(scaleX,scaleY,18,scaleH);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('45\u00b0C',scaleX-25,scaleY+8);ctx.fillText('30\u00b0C',scaleX-25,scaleY+scaleH/2);ctx.fillText('15\u00b0C',scaleX-25,scaleY+scaleH);

      /* zone labels */
      ctx.fillStyle='rgba(0,255,200,0.3)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('SENSOR SIDE',10,viewH-10);
      ctx.fillText('TARGET ZONE',W*0.65,viewH-10);

      /* ---- SECTION 2: Bottom-left — Temperature history ---- */
      var histX=10,histY=viewH+15,histW=W*0.55,histH=H-viewH-30;

      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(histX,histY,histW,histH);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(histX,histY,histW,histH);

      /* push new data */
      var histEntry={t:t};
      targets.forEach(function(tgt,i){histEntry['t'+i]=tgt.temp;});
      histEntry.ambient=ambientT;
      timeHistory.push(histEntry);
      if(timeHistory.length>MAX_HISTORY)timeHistory.shift();

      /* draw temp traces */
      var colors=['#ff6633','#6699ff','#ffcc00'];
      targets.forEach(function(tgt,ti){
        ctx.beginPath();ctx.strokeStyle=colors[ti]||'#fff';ctx.lineWidth=1.5;
        for(var i=0;i<timeHistory.length;i++){
          var x=histX+5+(i/MAX_HISTORY)*histW*0.95;
          var v=timeHistory[i]['t'+ti]||ambientT;
          var y=histY+histH-(v-15)/30*histH;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.stroke();
      });

      /* ambient line */
      var ambY=histY+histH-(ambientT-15)/30*histH;
      ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.setLineDash([3,3]);ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(histX,ambY);ctx.lineTo(histX+histW,ambY);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('AMBIENT '+ambientT.toFixed(1)+'\u00b0C',histX+histW-100,ambY-3);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('TEMPERATURE HISTORY',histX+5,histY+12);
      /* legend */
      targets.forEach(function(tgt,i){
        ctx.fillStyle=colors[i];ctx.fillRect(histX+5+i*100,histY+histH-14,10,3);
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='7px Orbitron,monospace';
        ctx.fillText(tgt.label,histX+18+i*100,histY+histH-10);
      });

      /* ---- SECTION 3: Bottom-right — Detection stats ---- */
      var statX=histX+histW+15,statY=histY,statW=W-statX-15,statH=histH;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(statX,statY,statW,statH);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(statX,statY,statW,statH);

      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('DETECTION STATUS',statX+10,statY+16);

      /* detection confidence */
      var conf=showWallV?(62+Math.sin(t*2)*8):(94+Math.sin(t*3)*3);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('Targets: '+targets.length,statX+10,statY+35);
      ctx.fillText('Wall: '+(showWallV?'ACTIVE':'REMOVED'),statX+10,statY+50);
      ctx.fillText('Confidence: '+conf.toFixed(0)+'%',statX+10,statY+65);
      ctx.fillText('Range: '+(showWallV?'5m':'2m'),statX+10,statY+80);
      ctx.fillText('Ambient: '+ambientT.toFixed(1)+'\u00b0C',statX+10,statY+95);

      /* confidence bar */
      var barY=statY+110;
      ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(statX+10,barY,statW-20,14);
      var confColor=conf>80?'#33ff33':conf>60?'#ffcc00':'#ff3333';
      ctx.fillStyle=confColor;ctx.fillRect(statX+10,barY,(statW-20)*conf/100,14);
      ctx.fillStyle='#fff';ctx.font='bold 8px Orbitron,monospace';
      ctx.fillText(conf.toFixed(0)+'%',statX+statW/2-10,barY+11);

      /* target temp readouts */
      targets.forEach(function(tgt,i){
        var ty=barY+25+i*30;
        ctx.fillStyle=colors[i];ctx.beginPath();ctx.arc(statX+18,ty+5,4,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='9px Orbitron,monospace';
        ctx.fillText(tgt.label,statX+28,ty+3);
        ctx.fillStyle='#fff';ctx.font='bold 11px Orbitron,monospace';
        ctx.fillText(tgt.temp.toFixed(1)+'\u00b0C',statX+28,ty+18);
      });

      /* ---- HUD ---- */
      ctx.strokeStyle='rgba(255,80,0,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(255,80,0,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });
      /* live dot */
      ctx.fillStyle='rgba(255,80,0,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('THERMAL',W-70,17);

      /* dividers */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,viewH+8);ctx.lineTo(W,viewH+8);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* click to add target */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      if(my<H*0.6&&mx>W*0.5){
        targets.push({x:mx,y:my,vx:(Math.random()-0.5)*0.8,vy:(Math.random()-0.5)*0.5,temp:36.5+Math.random()*1.5,size:18+Math.random()*8,label:'Person '+(targets.length+1)});
      }
      /* click wall to toggle */
      if(mx>wallX-10&&mx<wallX+wallW+10&&my<H*0.6){showWallV=!showWallV;}
    });

    /* auto-emit RF */
    setInterval(emitPulse,600);

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootThermalViz);
  else setTimeout(bootThermalViz,200);
})();
