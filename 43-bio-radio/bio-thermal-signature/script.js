/**
 * Workshop DIY — Bio Thermal Signature v1.0
 * Detect humans through walls via thermal RF
 */
const LANG={
  en:{title:'Bio Thermal Signature',subtitle:'See through walls with thermal RF',disconnected:'Disconnected',connected:'Connected',mainSection:'Thermal Signature \u2014 Through-Wall Detection',mainDesc:'Detect human thermal signatures through walls using RF',ready:'\ud83c\udf21 Thermal Scanner ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Bio Signature Thermique',subtitle:'Voir \u00e0 travers les murs avec RF thermique',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Signature Thermique \u2014 D\u00e9tection Murale',mainDesc:'D\u00e9tecter les signatures thermiques humaines',ready:'\ud83c\udf21 Scanner thermique pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'\u0627\u0644\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629',subtitle:'\u0631\u0624\u064a\u0629 \u0639\u0628\u0631 \u0627\u0644\u062c\u062f\u0631\u0627\u0646 \u0628\u0627\u0644\u062d\u0631\u0627\u0631\u0629 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0627\u0644\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629 \u2014 \u0643\u0634\u0641 \u0639\u0628\u0631 \u0627\u0644\u062c\u062f\u0631\u0627\u0646',mainDesc:'\u0643\u0634\u0641 \u0627\u0644\u0628\u0635\u0645\u0627\u062a \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629 \u0627\u0644\u0628\u0634\u0631\u064a\u0629',ready:'\ud83c\udf21 \u0627\u0644\u0645\u0627\u0633\u062d \u0627\u0644\u062d\u0631\u0627\u0631\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}
};

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
