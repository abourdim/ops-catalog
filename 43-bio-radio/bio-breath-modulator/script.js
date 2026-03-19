/**
 * Workshop DIY — Bio Breath Modulator v1.0
 * Breathing pattern modulates RF carrier
 */
const LANG={
  en:{title:'Bio Breath Modulator',subtitle:'Breathing modulates RF carrier',disconnected:'Disconnected',connected:'Connected',mainSection:'Breath Modulator \u2014 RF Carrier Control',mainDesc:'Your breathing pattern modulates a radio frequency carrier',sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',ready:'\ud83e\udec1 Breath Modulator ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Bio Modulateur Respiratoire',subtitle:'La respiration module la porteuse RF',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Modulateur Respiratoire \u2014 Contr\u00f4le RF',mainDesc:'Votre respiration module un signal porteur radio',ready:'\ud83e\udec1 Modulateur pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'\u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633',subtitle:'\u0627\u0644\u062a\u0646\u0641\u0633 \u064a\u0639\u062f\u0644 \u062d\u0627\u0645\u0644 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633 \u2014 \u062a\u062d\u0643\u0645 RF',mainDesc:'\u0646\u0645\u0637 \u062a\u0646\u0641\u0633\u0643 \u064a\u0639\u062f\u0644 \u0625\u0634\u0627\u0631\u0629 \u0631\u0627\u062f\u064a\u0648',ready:'\ud83e\udec1 \u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633 \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}
};

let breathRunning=false,breathPhase=0,breathRate=14,breathDepth=72,isTx=false;
let breathData=[],carrierData=[];

function initApp(){
  const canvas=$('breathCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;
  const W=canvas.width,H=canvas.height;let t=0;

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(0,0,W,H);t+=.016;
    if(breathRunning){
      breathPhase+=.016*breathRate/60*Math.PI*2;
      const envelope=Math.sin(breathPhase)*.5+.5;// 0=exhale,1=inhale
      breathDepth=Math.round(envelope*100);
      const carrierFreq=433.92+envelope*.5;// FM deviation
      breathData.push(envelope*H*.3);if(breathData.length>W)breathData.shift();
      // Carrier with FM modulation
      const carrier=Math.sin(t*carrierFreq*2)*20*envelope;
      carrierData.push(carrier);if(carrierData.length>W)carrierData.shift();
      breathRate=Math.round(12+Math.sin(t*.1)*3);

      const bd=$('breathDisplay'),sr=$('statRate'),sd=$('statDepth'),sc=$('statCarrier');
      const phase=envelope>.5?'Inhale...':'Exhale...';
      if(bd)bd.textContent=`${phase} | Rate: ${breathRate} BrPM | Carrier: ${carrierFreq.toFixed(2)} MHz`;
      if(sr)sr.textContent=breathRate;if(sd)sd.textContent=breathDepth;if(sc)sc.textContent=carrierFreq.toFixed(2);
    }

    // Draw breathing envelope (top half)
    if(breathData.length>1){
      ctx.beginPath();ctx.strokeStyle='#66ffcc';ctx.lineWidth=3;ctx.shadowColor='#66ffcc';ctx.shadowBlur=10;
      breathData.forEach((v,i)=>{const x=i,y=H*.25-v+H*.15;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();ctx.shadowBlur=0;
    }

    // Draw carrier (bottom half)
    if(carrierData.length>1&&isTx){
      ctx.beginPath();ctx.strokeStyle='#ff6633';ctx.lineWidth=1;
      carrierData.forEach((v,i)=>{const x=i,y=H*.7+v;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='10px Orbitron';
    ctx.fillText('BREATH ENVELOPE',10,20);
    ctx.fillText('RF CARRIER (433.92 MHz FM)',10,H*.55+15);

    // Divider
    ctx.strokeStyle='rgba(255,255,255,.1)';ctx.setLineDash([4,8]);
    ctx.beginPath();ctx.moveTo(0,H*.5);ctx.lineTo(W,H*.5);ctx.stroke();ctx.setLineDash([]);

    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),inhaleBtn=$('inhaleBtn'),exhaleBtn=$('exhaleBtn'),txBtn=$('txBtn');
  if(startBtn)startBtn.onclick=()=>{breathRunning=!breathRunning;setStatus(breathRunning);log(breathRunning?'Breathing simulation started':'Stopped','info')};
  if(inhaleBtn)inhaleBtn.onclick=()=>{breathPhase=Math.PI/2;log('Manual inhale','info')};
  if(exhaleBtn)exhaleBtn.onclick=()=>{breathPhase=3*Math.PI/2;log('Manual exhale','info')};
  if(txBtn)txBtn.onclick=()=>{isTx=!isTx;log(isTx?'TX: Carrier modulation ON':'TX: Carrier OFF',isTx?'tx':'info');showToast(isTx?'Transmitting...':'TX Off',1500)};
}
