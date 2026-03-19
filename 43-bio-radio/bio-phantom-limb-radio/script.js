/** Workshop DIY — Bio Phantom Limb Radio v1.0 — Detect prosthetic/implant RF emissions */
const LANG={en:{title:'Bio Phantom Limb Radio',subtitle:'Detect prosthetic & implant RF emissions',disconnected:'Disconnected',connected:'Connected',ready:'\ud83e\uddbf Phantom Limb Radio ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Bio Radio Membre Fant\u00f4me',subtitle:'D\u00e9tecter les \u00e9missions RF des proth\u00e8ses/implants',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',ready:'\ud83e\uddbf Radio fant\u00f4me pr\u00eate!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0639\u0636\u0648 \u0627\u0644\u0634\u0628\u062d\u064a',subtitle:'\u0643\u0634\u0641 \u0625\u0634\u0627\u0631\u0627\u062a RF \u0645\u0646 \u0627\u0644\u0623\u0637\u0631\u0627\u0641 \u0627\u0644\u0635\u0646\u0627\u0639\u064a\u0629',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',ready:'\ud83e\uddbf \u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0639\u0636\u0648 \u0627\u0644\u0634\u0628\u062d\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}};
const IMPLANTS=[{name:'Cochlear Implant',freq:'2.4GHz',power:'-30dBm',protocol:'BLE',color:'#33ff33'},{name:'Cardiac Pacemaker',freq:'402MHz',power:'-45dBm',protocol:'MICS',color:'#ff3366'},{name:'Insulin Pump',freq:'916MHz',power:'-40dBm',protocol:'ISM',color:'#6699ff'},{name:'Neural Stimulator',freq:'401MHz',power:'-50dBm',protocol:'MedRadio',color:'#ffcc00'},{name:'Prosthetic Hand',freq:'2.4GHz',power:'-25dBm',protocol:'BLE',color:'#ff6633'}];
let scanning=false,detected=[],rfData=[];
function initApp(){const canvas=$('phantomCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=340;const W=canvas.width,H=canvas.height;let t=0;
function frame(){ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t+=.016;
// Waterfall spectrum
if(scanning){const row=[];for(let i=0;i<128;i++){let v=Math.random()*20-90;// Noise floor
detected.forEach(d=>{const imp=IMPLANTS[d];const cf=parseFloat(imp.freq)*100;const bin=i*20;const diff=Math.abs(bin-cf%2560);if(diff<30)v+=40*Math.exp(-diff*diff/200)+Math.random()*5});row.push(v)}rfData.push(row);if(rfData.length>H/2)rfData.shift()}
// Draw waterfall
rfData.forEach((row,y)=>{row.forEach((v,x)=>{const norm=(v+90)/60;const r=Math.min(255,norm*512);const g=Math.min(255,Math.max(0,(norm-.3)*512));const b=Math.max(0,(1-norm)*150);ctx.fillStyle=`rgb(${r|0},${g|0},${b|0})`;ctx.fillRect(x*(W/128),y*2,W/128+1,2)})});
// Detected implants list
const ly=H*.6;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,ly,W,H-ly);ctx.strokeStyle='rgba(255,255,255,.1)';ctx.strokeRect(0,ly,W,H-ly);
ctx.fillStyle='#fff';ctx.font='bold 11px Orbitron';ctx.fillText('DETECTED RF EMISSIONS',10,ly+18);
detected.forEach((d,i)=>{const imp=IMPLANTS[d];const y2=ly+35+i*22;ctx.fillStyle=imp.color;ctx.beginPath();ctx.arc(15,y2,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='10px Orbitron';ctx.fillText(`${imp.name}  |  ${imp.freq}  |  ${imp.power}  |  ${imp.protocol}`,28,y2+4);
// Signal strength animation
const sw=80+Math.sin(t*3+i)*10;ctx.fillStyle=imp.color+'44';ctx.fillRect(W-sw-20,y2-8,sw,16);ctx.fillStyle=imp.color;ctx.fillRect(W-sw-20,y2-8,sw*.7,16)});
const sd=$('statDetected'),sf=$('statFreqs');
if(sd)sd.textContent=detected.length;if(sf)sf.textContent=detected.map(d=>IMPLANTS[d].freq).join(', ')||'none';
requestAnimationFrame(frame)}frame();
const startBtn=$('startBtn'),addBtn=$('addBtn'),clearBtn=$('clearDetBtn'),analyzeBtn=$('analyzeBtn');
if(startBtn)startBtn.onclick=()=>{scanning=!scanning;setStatus(scanning);log(scanning?'RF scanner active \u2014 detecting implant emissions':'Scanner off','info')};
if(addBtn)addBtn.onclick=()=>{const idx=Math.floor(Math.random()*IMPLANTS.length);if(!detected.includes(idx)){detected.push(idx);const imp=IMPLANTS[idx];log(`Detected: ${imp.name} @ ${imp.freq} (${imp.power}) [${imp.protocol}]`,'success');showToast(`Found: ${imp.name}`,1500)}else{log('Scanning... no new emissions','info')}};
if(clearBtn)clearBtn.onclick=()=>{detected=[];rfData=[];log('Detection cleared','info')};
if(analyzeBtn)analyzeBtn.onclick=()=>{if(detected.length===0){log('No implants detected yet','error');return}
detected.forEach(d=>{const imp=IMPLANTS[d];log(`Analysis: ${imp.name} \u2014 Freq:${imp.freq} Power:${imp.power} Protocol:${imp.protocol} Status:ACTIVE`,'rx')});showToast(`Analyzed ${detected.length} implants`,1500)}}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ PHANTOM LIMB RADIO CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootPhantomViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,50,100,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    var implants=[
      {name:'Cochlear Implant',freq:2400,band:'2.4GHz',power:-30,protocol:'BLE',color:'#33ff33',bx:0.48,by:0.15},
      {name:'Cardiac Pacemaker',freq:402,band:'402MHz',power:-45,protocol:'MICS',color:'#ff3366',bx:0.44,by:0.38},
      {name:'Insulin Pump',freq:916,band:'916MHz',power:-40,protocol:'ISM',color:'#6699ff',bx:0.55,by:0.48},
      {name:'Neural Stimulator',freq:401,band:'401MHz',power:-50,protocol:'MedRadio',color:'#ffcc00',bx:0.48,by:0.08},
      {name:'Prosthetic Hand',freq:2400,band:'2.4GHz',power:-25,protocol:'BLE',color:'#ff6633',bx:0.35,by:0.58},
      {name:'Knee Implant',freq:868,band:'868MHz',power:-35,protocol:'ISM',color:'#cc66ff',bx:0.46,by:0.75},
      {name:'Retinal Implant',freq:900,band:'900MHz',power:-48,protocol:'ISM',color:'#00ccff',bx:0.45,by:0.12}
    ];

    var activeImplants=[0,1,4],pulseRings=[];
    var waterfallData=[],MAX_WATERFALL=100,scanAngle=0;
    var bodyW=180,bodyH=420,bodyOX=100,bodyOY=60;

    function bx2(nx){return bodyOX+nx*bodyW;}
    function by2(ny){return bodyOY+ny*bodyH;}

    function toggleImplant(idx){
      var pos=activeImplants.indexOf(idx);
      if(pos>=0)activeImplants.splice(pos,1);
      else{activeImplants.push(idx);pulseRings.push({x:bx2(implants[idx].bx),y:by2(implants[idx].by),r:5,color:implants[idx].color,alpha:1});}
    }

    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.14)';ctx.fillRect(0,0,W,H);
      t+=0.016;scanAngle+=0.02;

      var bodyRegionW=W*0.4;

      /* scanning sweep */
      ctx.save();ctx.beginPath();ctx.moveTo(bx2(0.50),by2(0.40));
      ctx.arc(bx2(0.50),by2(0.40),200,scanAngle-0.3,scanAngle,false);ctx.closePath();
      var sg=ctx.createRadialGradient(bx2(0.50),by2(0.40),0,bx2(0.50),by2(0.40),200);
      sg.addColorStop(0,'rgba(0,255,200,0.08)');sg.addColorStop(1,'rgba(0,255,200,0)');
      ctx.fillStyle=sg;ctx.fill();ctx.restore();

      /* body outline */
      ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(bx2(0.50),by2(0.10),14,18,0,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx2(0.50),by2(0.16));ctx.lineTo(bx2(0.50),by2(0.55));ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx2(0.50),by2(0.22));ctx.lineTo(bx2(0.32),by2(0.50));ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx2(0.50),by2(0.22));ctx.lineTo(bx2(0.68),by2(0.50));ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx2(0.50),by2(0.55));ctx.lineTo(bx2(0.42),by2(0.85));ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx2(0.50),by2(0.55));ctx.lineTo(bx2(0.58),by2(0.85));ctx.stroke();
      /* torso fill */
      ctx.fillStyle='rgba(0,150,255,0.03)';
      ctx.beginPath();ctx.moveTo(bx2(0.42),by2(0.20));ctx.lineTo(bx2(0.58),by2(0.20));
      ctx.lineTo(bx2(0.56),by2(0.55));ctx.lineTo(bx2(0.44),by2(0.55));ctx.closePath();ctx.fill();

      /* implant dots and emissions */
      implants.forEach(function(imp,idx){
        var ix=bx2(imp.bx),iy=by2(imp.by);
        var isActive=activeImplants.indexOf(idx)>=0;
        ctx.beginPath();ctx.arc(ix,iy,isActive?6:4,0,Math.PI*2);
        ctx.fillStyle=imp.color+(isActive?'cc':'44');ctx.fill();
        if(isActive){
          for(var r=0;r<3;r++){
            var rad=10+r*12+Math.sin(t*4+idx)*5;
            ctx.beginPath();ctx.arc(ix,iy,rad,0,Math.PI*2);
            ctx.strokeStyle=imp.color+((0.3-r*0.08>0)?Math.round((0.3-r*0.08)*255).toString(16).padStart(2,'0'):'05');
            ctx.lineWidth=1;ctx.stroke();
          }
          ctx.fillStyle=imp.color;ctx.font='8px Orbitron,monospace';
          ctx.fillText(imp.name.split(' ')[0],ix+12,iy-2);
          ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fillText(imp.band,ix+12,iy+9);
        }
      });

      /* pulse rings */
      for(var pi=pulseRings.length-1;pi>=0;pi--){
        var pr=pulseRings[pi];pr.r+=1.5;pr.alpha-=0.015;
        if(pr.alpha<=0){pulseRings.splice(pi,1);continue;}
        ctx.beginPath();ctx.arc(pr.x,pr.y,pr.r,0,Math.PI*2);
        ctx.strokeStyle=pr.color+Math.round(Math.max(0,pr.alpha)*255).toString(16).padStart(2,'0');
        ctx.lineWidth=2;ctx.stroke();
      }

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('IMPLANT BODY MAP',bodyOX-10,25);
      ctx.fillText('Click dots to toggle',bodyOX-10,H-15);

      /* ---- RIGHT: RF Spectrum ---- */
      var specX=bodyRegionW+20,specY=10,specW=W-specX-10,specH=H*0.32;
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(specX,specY,specW,specH);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(specX,specY,specW,specH);

      var numBins=128,binW=specW/numBins,specValues=[];
      for(var b=0;b<numBins;b++){
        var freq=b/numBins*3000;var amp=0.02+Math.random()*0.02;
        activeImplants.forEach(function(idx){
          var imp=implants[idx];var diff=Math.abs(freq-imp.freq);
          amp+=Math.exp(-diff*diff/1600)*Math.abs(imp.power)/30*(0.7+Math.sin(t*5+idx)*0.3);
        });
        specValues.push(Math.min(1,amp));
      }
      for(var b=0;b<numBins;b++){
        var barH=specValues[b]*specH*0.85;var hue=b/numBins*300;
        ctx.fillStyle='hsla('+hue+',70%,50%,'+(0.3+specValues[b]*0.6)+')';
        ctx.fillRect(specX+b*binW,specY+specH-barH,binW-0.5,barH);
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RF SPECTRUM (0-3GHz)',specX+5,specY+14);

      /* ---- WATERFALL ---- */
      var wfY=specY+specH+10,wfH=H*0.28;
      waterfallData.push(specValues);if(waterfallData.length>MAX_WATERFALL)waterfallData.shift();
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(specX,wfY,specW,wfH);
      var rowH=wfH/MAX_WATERFALL;
      for(var row=0;row<waterfallData.length;row++){
        var vals=waterfallData[row];
        for(var col=0;col<vals.length;col++){
          var v=vals[col];
          ctx.fillStyle='rgb('+(Math.min(255,v*512)|0)+','+(Math.min(255,Math.max(0,(v-0.2)*512))|0)+','+(Math.max(0,(1-v*2)*100)|0)+')';
          ctx.fillRect(specX+col*binW,wfY+row*rowH,binW+0.5,rowH+0.5);
        }
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('WATERFALL',specX+5,wfY+12);

      /* ---- BOTTOM-RIGHT: Detected Table ---- */
      var tblY=wfY+wfH+15,tblH=H-tblY-10;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(specX,tblY,specW,tblH);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(specX,tblY,specW,tblH);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('DETECTED EMISSIONS',specX+10,tblY+14);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('DEVICE',specX+10,tblY+28);ctx.fillText('FREQ',specX+120,tblY+28);
      ctx.fillText('PWR',specX+170,tblY+28);ctx.fillText('PROTO',specX+210,tblY+28);ctx.fillText('SIGNAL',specX+260,tblY+28);
      activeImplants.forEach(function(idx,i){
        var imp=implants[idx];var rowYt=tblY+42+i*18;if(rowYt>H-15)return;
        ctx.fillStyle=imp.color;ctx.beginPath();ctx.arc(specX+14,rowYt,3,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(imp.name.substring(0,14),specX+22,rowYt+3);
        ctx.fillText(imp.band,specX+120,rowYt+3);ctx.fillText(imp.power+'dBm',specX+165,rowYt+3);ctx.fillText(imp.protocol,specX+210,rowYt+3);
        var sigW=60+Math.sin(t*3+idx)*12;
        ctx.fillStyle=imp.color+'44';ctx.fillRect(specX+260,rowYt-6,70,10);
        ctx.fillStyle=imp.color;ctx.fillRect(specX+260,rowYt-6,sigW,10);
      });
      if(activeImplants.length===0){
        ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='9px Orbitron,monospace';
        ctx.fillText('No implants active',specX+30,tblY+55);
      }

      /* HUD */
      ctx.strokeStyle='rgba(255,50,100,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(255,50,100,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });
      ctx.fillStyle='rgba(255,50,100,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,H-20,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('RF SCAN',W-70,H-17);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(bodyRegionW+10,0);ctx.lineTo(bodyRegionW+10,H);ctx.stroke();

      requestAnimationFrame(frame);
    }

    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width),my=(e.clientY-rect.top)*(H/rect.height);
      implants.forEach(function(imp,idx){
        var ix=bx2(imp.bx),iy=by2(imp.by);
        if(Math.sqrt((mx-ix)*(mx-ix)+(my-iy)*(my-iy))<18)toggleImplant(idx);
      });
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootPhantomViz);
  else setTimeout(bootPhantomViz,200);
})();
