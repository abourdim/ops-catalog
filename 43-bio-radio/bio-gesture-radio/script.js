/** Workshop DIY — Bio Gesture Radio v1.0 — Hand gestures modulate BLE for covert sign language */
const LANG={en:{title:'Bio Gesture Radio',subtitle:'Hand gestures modulate BLE signals',disconnected:'Disconnected',connected:'Connected',mainSection:'Gesture Radio \u2014 Covert Sign Language via BLE',mainDesc:'Hand gestures detected and transmitted as modulated BLE',ready:'\u270b Gesture Radio ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Bio Radio Gestuelle',subtitle:'Gestes de la main modulent le BLE',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',ready:'\u270b Radio gestuelle pr\u00eate!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a',subtitle:'\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u0627\u0644\u064a\u062f \u062a\u0639\u062f\u0644 BLE',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',ready:'\u270b \u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}};
const GESTURES=[{name:'PEACE',icon:'\u270c\ufe0f',pattern:[0,1,1,0,0]},{name:'FIST',icon:'\u270a',pattern:[1,1,1,1,1]},{name:'OPEN',icon:'\ud83d\udd90\ufe0f',pattern:[0,0,0,0,0]},{name:'POINT',icon:'\ud83d\udc46',pattern:[0,1,0,0,0]},{name:'OK',icon:'\ud83d\udc4c',pattern:[1,0,0,0,1]},{name:'THUMBS UP',icon:'\ud83d\udc4d',pattern:[0,0,0,0,1]}];
let detecting=false,currentGesture=0,gestureLog=[],blePackets=[];
function initApp(){const canvas=$('gestCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;const W=canvas.width,H=canvas.height;let t=0;
function drawHand(gesture){const cx=W*.25,cy=H*.5;const fingers=gesture.pattern;ctx.strokeStyle='#d4a03c';ctx.lineWidth=4;ctx.lineCap='round';
// Palm
ctx.beginPath();ctx.arc(cx,cy,35,0,Math.PI*2);ctx.stroke();
// Fingers
const angles=[-1.2,-.6,0,.6,1.2];const lengths=[40,55,60,55,45];
angles.forEach((a,i)=>{const len=fingers[i]?lengths[i]*.4:lengths[i];const ex=cx+Math.sin(a)*len-10,ey=cy-Math.cos(a)*len-20;ctx.beginPath();ctx.moveTo(cx+Math.sin(a)*30-10,cy-Math.cos(a)*30-20);ctx.lineTo(ex,ey);ctx.strokeStyle=fingers[i]?'#ff6633':'#33ff33';ctx.lineWidth=6;ctx.stroke()})}
function frame(){ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t+=.016;
if(detecting){if(Math.random()<.02){currentGesture=(currentGesture+1)%GESTURES.length;gestureLog.push({gesture:GESTURES[currentGesture],time:Date.now()});const sg=$('statGesture'),sc=$('statCount');if(sg)sg.textContent=GESTURES[currentGesture].name;if(sc)sc.textContent=gestureLog.length;log(`Detected: ${GESTURES[currentGesture].icon} ${GESTURES[currentGesture].name}`,'rx')}}
drawHand(GESTURES[currentGesture]);
// Gesture label
ctx.fillStyle='#ffcc00';ctx.font='bold 24px Orbitron';ctx.textAlign='center';ctx.fillText(`${GESTURES[currentGesture].icon} ${GESTURES[currentGesture].name}`,W*.25,H*.9);ctx.textAlign='left';
// BLE visualization
const bx=W*.55;ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(bx,20,W-bx-20,H-40);ctx.strokeStyle='rgba(255,255,255,.1)';ctx.strokeRect(bx,20,W-bx-20,H-40);ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='10px Orbitron';ctx.fillText('BLE BROADCAST',bx+10,40);
// Draw BLE packets
blePackets.forEach((p,i)=>{p.x+=1.5;p.life-=.01;if(p.life<=0){blePackets.splice(i,1);return}ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(bx+p.x,p.y,4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill()});ctx.globalAlpha=1;
// Pattern display
const g=GESTURES[currentGesture];ctx.fillStyle='#33ff33';ctx.font='14px monospace';ctx.fillText(`Pattern: [${g.pattern.join(',')}]`,bx+10,H-30);
requestAnimationFrame(frame)}frame();
const startBtn=$('startBtn'),gestBtn=$('gestBtn'),txBtn=$('txBtn');
if(startBtn)startBtn.onclick=()=>{detecting=!detecting;setStatus(detecting);log(detecting?'Gesture detection started':'Stopped','info')};
if(gestBtn)gestBtn.onclick=()=>{currentGesture=(currentGesture+1)%GESTURES.length;const g=GESTURES[currentGesture];log(`Manual: ${g.icon} ${g.name}`,'info')};
if(txBtn)txBtn.onclick=()=>{const g=GESTURES[currentGesture];for(let i=0;i<10;i++)blePackets.push({x:0,y:60+Math.random()*200,life:1,color:g.pattern[i%5]?'#ff6633':'#33ff33'});log(`TX: ${g.name} [${g.pattern}] via BLE`,'tx');showToast(`Sent: ${g.icon}`,1200)}}
