/**
 * Workshop DIY — Bio Skin Galvanic Key v1.0
 * Skin conductance as cryptographic key generation
 */
const LANG={
  en:{title:'Bio Skin Galvanic Key',subtitle:'Skin conductance as crypto key',disconnected:'Disconnected',connected:'Connected',mainSection:'Galvanic Skin Response \u2014 Crypto Key Gen',mainDesc:'Electrodermal activity generates unique keys',sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',activityLog:'Log',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'\u2699\ufe0f Settings',language:'Language',theme:'Theme',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sound',splashHint:'tap to skip',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\ud83d\udca7 Galvanic Key ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 English',themeChanged:'\ud83c\udfa8 Theme \u2192'},
  fr:{title:'Bio Cl\u00e9 Galvanique',subtitle:'Conductance cutan\u00e9e comme cl\u00e9 crypto',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'R\u00e9ponse Galvanique \u2014 G\u00e9n\u00e9ration Cl\u00e9',mainDesc:'L\'activit\u00e9 \u00e9lectrodermale g\u00e9n\u00e8re des cl\u00e9s uniques',sectionA:'A \u2014 Fonctionnement',sectionC:'C \u2014 D\u00e9fis',activityLog:'Journal',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'\u2699\ufe0f Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sons',splashHint:'appuyer',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\ud83d\udca7 Cl\u00e9 galvanique pr\u00eate!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 Fran\u00e7ais',themeChanged:'\ud83c\udfa8 Th\u00e8me \u2192'},
  ar:{title:'\u0645\u0641\u062a\u0627\u062d \u0627\u0644\u062c\u0644\u062f \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a',subtitle:'\u0645\u0648\u0635\u0644\u064a\u0629 \u0627\u0644\u062c\u0644\u062f \u0643\u0645\u0641\u062a\u0627\u062d \u062a\u0634\u0641\u064a\u0631',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0627\u0633\u062a\u062c\u0627\u0628\u0629 \u0627\u0644\u062c\u0644\u062f \u2014 \u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d',mainDesc:'\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064a \u0644\u0644\u062c\u0644\u062f \u064a\u0648\u0644\u062f \u0645\u0641\u0627\u062a\u064a\u062d \u0641\u0631\u064a\u062f\u0629',sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',sectionC:'\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',activityLog:'\u0633\u062c\u0644',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u062f\u0644\u064a\u0644',wiki:'\u0648\u064a\u0643\u064a',soundEffects:'\ud83d\udd0a \u0635\u0648\u062a',splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d\u2026',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',ready:'\ud83d\udca7 \u0645\u0641\u062a\u0627\u062d \u0627\u0644\u062c\u0644\u062f \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a\u0629',themeChanged:'\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190'}
};

/* ═══════ GSR CRYPTO KEY SIMULATION ═══════ */
let gsrRunning=false,gsrMode='normal',gsrData=[],keysGen=0;
let gsrVal=4.7,stressLevel=32;

function initApp(){
  const canvas=$('gsrCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=300;
  const W=canvas.width,H=canvas.height;let t=0;

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t++;
    if(gsrRunning){
      const target=gsrMode==='stress'?12:gsrMode==='calm'?2:4.7;
      gsrVal+=(target-gsrVal)*.01+(Math.random()-.5)*.3;
      gsrVal=Math.max(.5,Math.min(20,gsrVal));
      stressLevel=Math.round(Math.min(100,Math.max(0,(gsrVal-2)/16*100)));
      gsrData.push(gsrVal);if(gsrData.length>W)gsrData.shift();

      const gd=$('gsrDisplay'),sg=$('statGSR'),ss=$('statStress');
      if(gd)gd.textContent=`GSR: ${gsrVal.toFixed(1)} \u00b5S | Stress: ${stressLevel}%`;
      if(sg)sg.textContent=gsrVal.toFixed(1);if(ss)ss.textContent=stressLevel;
    }

    // Draw GSR trace
    if(gsrData.length>1){
      ctx.beginPath();ctx.strokeStyle='#00ccff';ctx.lineWidth=2;ctx.shadowColor='#00ccff';ctx.shadowBlur=6;
      gsrData.forEach((v,i)=>{const x=i,y=H-v/20*H;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();ctx.shadowBlur=0;
    }

    // Fill area under curve
    if(gsrData.length>1){
      ctx.beginPath();ctx.moveTo(0,H);
      gsrData.forEach((v,i)=>{ctx.lineTo(i,H-v/20*H)});
      ctx.lineTo(gsrData.length-1,H);ctx.closePath();
      ctx.fillStyle='rgba(0,204,255,.08)';ctx.fill();
    }

    // Grid
    ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=.5;
    for(let i=0;i<H;i+=60){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.2)';ctx.font='9px Orbitron';ctx.fillText(`${(20-i/H*20).toFixed(0)}\u00b5S`,W-40,i+12)}

    // Stress meter
    const mw=150,mh=20,mx=W/2-mw/2,my=H-35;
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(mx,my,mw,mh);
    const gradient=ctx.createLinearGradient(mx,0,mx+mw,0);
    gradient.addColorStop(0,'#33ff33');gradient.addColorStop(.5,'#ffcc00');gradient.addColorStop(1,'#ff3333');
    ctx.fillStyle=gradient;ctx.fillRect(mx,my,mw*stressLevel/100,mh);
    ctx.strokeStyle='rgba(255,255,255,.2)';ctx.strokeRect(mx,my,mw,mh);
    ctx.fillStyle='#fff';ctx.font='bold 10px Orbitron';ctx.textAlign='center';
    ctx.fillText(`Stress: ${stressLevel}%`,mx+mw/2,my+14);ctx.textAlign='left';

    requestAnimationFrame(frame);
  }
  frame();

  // Controls
  const startBtn=$('startBtn'),stressBtn=$('stressBtn'),calmBtn=$('calmBtn'),genKeyBtn=$('genKeyBtn');
  if(startBtn)startBtn.onclick=()=>{gsrRunning=!gsrRunning;setStatus(gsrRunning);log(gsrRunning?'GSR measurement started':'GSR stopped','info')};
  if(stressBtn)stressBtn.onclick=()=>{gsrMode='stress';log('Mode: Stress simulation','info')};
  if(calmBtn)calmBtn.onclick=()=>{gsrMode='calm';log('Mode: Calm/relaxed','info')};
  if(genKeyBtn)genKeyBtn.onclick=()=>{
    if(gsrData.length<50){log('Collect more GSR data first (need 50+ samples)','error');return}
    // Generate crypto key from GSR LSBs
    const keyBytes=[];
    for(let i=0;i<32;i++){
      const idx=Math.floor(Math.random()*gsrData.length);
      const lsb=Math.round(gsrData[idx]*1000)&0xFF;
      keyBytes.push(lsb^(Math.round(gsrData[(idx+7)%gsrData.length]*1000)&0xFF));
    }
    const hex=keyBytes.map(b=>b.toString(16).padStart(2,'0')).join('');
    const out=$('keyOutput');if(out)out.textContent=hex;
    keysGen++;
    const se=$('statEntropy'),sk=$('statKeys');
    if(se)se.textContent=keyBytes.length*8;if(sk)sk.textContent=keysGen;
    log(`Key generated: ${hex.slice(0,32)}... (256 bits)`,'success');
    showToast('Crypto key generated!',1500);
  };
}
