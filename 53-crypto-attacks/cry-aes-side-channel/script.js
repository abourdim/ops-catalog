/**
 * AES Side Channel — Workshop DIY v1.0
 * Simulate power analysis attack on AES S-box lookups
 */
const $=id=>document.getElementById(id);
const SBOX=[0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];
function hammingWeight(v){let c=0;while(v){c+=v&1;v>>=1}return c}
const LANG={
  en:{title:'AES Side Channel',subtitle:'Observe power/timing leaks during AES rounds',mainSection:'Side Channel Analysis',mainDesc:'Visualize simulated power traces from AES S-box',keyLabel:'AES Key (hex)',ptLabel:'Plaintext (hex)',tracesLabel:'Number of Traces',capture:'Capture Traces',analyze:'Analyze (CPA)',stop:'Stop',results:'Results',vizTitle:'Power Trace Visualization',vizHint:'Simulated power consumption during AES S-box lookups',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',capturing:'Capturing traces...',analyzing:'Running CPA...',keyRecovered:'Key byte recovered!',
    faq_q1:'What is a side-channel attack?',faq_a1:'Exploiting physical leakage (power, timing, EM) from a crypto device to extract secret keys.',faq_q2:'What is CPA?',faq_a2:'Correlation Power Analysis correlates hypothetical power models with actual traces to guess key bytes.',faq_q3:'Is this realistic?',faq_a3:'Simplified but based on real DPA/CPA principles. Real attacks use oscilloscopes and thousands of traces.',howto_1:'Enter AES key and plaintext in hex.',howto_2:'Click Capture Traces to simulate encryption.',howto_3:'Click Analyze to run CPA attack.',howto_4:'Watch power traces correlate with key guesses.',
    wiki_sbox:'The S-box substitution is AES\'s main nonlinear operation. Its power consumption leaks information about processed data.',wiki_hamming:'Hamming weight model: power ~ number of 1-bits in processed value. HW(SBox[pt XOR key]) correlates with actual power.',wiki_cpa:'CPA computes Pearson correlation between hypothetical and measured power for each key guess. Highest correlation reveals the key.',
    mathExplain:'CPA Attack on AES:\n\nFor each key byte guess k (0..255):\n  For each trace i:\n    h[i] = HW(SBox[plaintext[i] XOR k])\n  correlation[k] = Pearson(h, measured_power)\n\nCorrect key byte has highest correlation.\n\nHamming Weight: HW(x) = number of 1-bits in x\nPearson: r = cov(X,Y) / (std(X) * std(Y))'},
  fr:{title:'Canal Auxiliaire AES',subtitle:'Observez les fuites de puissance/temps pendant AES',mainSection:'Analyse Canal Auxiliaire',mainDesc:'Visualisez les traces de puissance simulees',keyLabel:'Cle AES (hex)',ptLabel:'Texte clair (hex)',tracesLabel:'Nombre de traces',capture:'Capturer',analyze:'Analyser (CPA)',stop:'Arreter',results:'Resultats',vizTitle:'Visualisation Traces',vizHint:'Consommation electrique simulee pendant AES',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',capturing:'Capture en cours...',analyzing:'CPA en cours...',keyRecovered:'Octet de cle recupere!',
    faq_q1:'Attaque par canal auxiliaire?',faq_a1:'Exploiter les fuites physiques (puissance, temps) pour extraire des cles.',faq_q2:'C\'est quoi CPA?',faq_a2:'Analyse de correlation de puissance pour deviner les octets de cle.',faq_q3:'C\'est realiste?',faq_a3:'Simplifie mais base sur de vrais principes DPA/CPA.',howto_1:'Entrez cle et texte clair en hex.',howto_2:'Cliquez Capturer.',howto_3:'Cliquez Analyser.',howto_4:'Regardez les correlations.',
    wiki_sbox:'La S-box est l\'operation non-lineaire principale d\'AES.',wiki_hamming:'Modele poids de Hamming: puissance ~ nombre de bits 1.',wiki_cpa:'CPA calcule la correlation de Pearson entre puissance hypothetique et mesuree.',
    mathExplain:'Attaque CPA sur AES:\n\nPour chaque hypothese k (0..255):\n  h[i] = HW(SBox[texte[i] XOR k])\n  correlation[k] = Pearson(h, puissance)\n\nLa bonne cle a la plus haute correlation.'},
  ar:{title:'القناة الجانبية AES',subtitle:'راقب تسريبات الطاقة والتوقيت أثناء جولات AES',mainSection:'تحليل القناة الجانبية',mainDesc:'تصور آثار الطاقة المحاكاة من بحث S-box',keyLabel:'مفتاح AES (hex)',ptLabel:'نص أصلي (hex)',tracesLabel:'عدد الآثار',capture:'التقاط',analyze:'تحليل CPA',stop:'إيقاف',results:'النتائج',vizTitle:'تصور آثار الطاقة',vizHint:'استهلاك الطاقة المحاكى أثناء AES',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',capturing:'جاري الالتقاط...',analyzing:'جاري تحليل CPA...',keyRecovered:'تم استرجاع بايت المفتاح!',
    faq_q1:'ما هو هجوم القناة الجانبية؟',faq_a1:'استغلال التسريبات الفيزيائية لاستخراج المفاتيح السرية.',faq_q2:'ما هو CPA؟',faq_a2:'تحليل ارتباط الطاقة لتخمين بايتات المفتاح.',faq_q3:'هل هذا واقعي؟',faq_a3:'مبسط لكن مبني على مبادئ DPA/CPA الحقيقية.',howto_1:'أدخل المفتاح والنص بالست عشري.',howto_2:'اضغط التقاط.',howto_3:'اضغط تحليل.',howto_4:'شاهد الارتباطات.',
    wiki_sbox:'صندوق S هو العملية غير الخطية الرئيسية في AES.',wiki_hamming:'نموذج وزن هامينغ: الطاقة تتناسب مع عدد البتات 1.',wiki_cpa:'CPA يحسب ارتباط بيرسون بين الطاقة الافتراضية والمقاسة.',
    mathExplain:'هجوم CPA على AES:\n\nلكل تخمين k (0..255):\n  h[i] = HW(SBox[نص[i] XOR k])\n  الارتباط[k] = بيرسون(h, الطاقة)\n\nالمفتاح الصحيح له أعلى ارتباط.'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;if($('langSelect'))$('langSelect').value=lang;try{localStorage.setItem('cry-aes-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));if($('themeSelect'))$('themeSelect').value=name;try{localStorage.setItem('cry-aes-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const tm=audioCtx.currentTime;o.frequency.value=t==='success'?523:t==='error'?200:800;o.type=t==='error'?'square':'sine';g.gain.exponentialRampToValueAtTime(.001,tm+.2);o.start(tm);o.stop(tm+.2)}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success')}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ POWER TRACE SIMULATION ═══════ */
let traces=[],plaintexts=[],correlations=[],running=false;
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function parseHex(s){const h=s.replace(/\s/g,'');const a=[];for(let i=0;i<h.length;i+=2)a.push(parseInt(h.substr(i,2),16)||0);return a}

function captureTraces(){
  const key=parseHex($('keyInput').value),nTraces=parseInt($('traceCount').value)||50;
  traces=[];plaintexts=[];const s=LANG[currentLang];log(s.capturing,'info');showToast(s.capturing);
  for(let t=0;t<nTraces;t++){
    const pt=[];for(let i=0;i<key.length;i++)pt.push(Math.floor(Math.random()*256));
    plaintexts.push(pt);
    const trace=[];
    for(let i=0;i<key.length;i++){
      const sboxOut=SBOX[pt[i]^key[i]];const hw=hammingWeight(sboxOut);
      trace.push(hw+(Math.random()-.5)*2); // hw + noise
    }
    traces.push(trace);
  }
  hideToast();log(`Captured ${nTraces} traces`,'success');
  $('resultsBox').textContent=`Captured ${nTraces} traces\nKey bytes: ${key.length}\nTrace length: ${key.length} points per trace`;
  drawCanvas()
}

function analyzeCPA(){
  if(traces.length===0){captureTraces()}
  const s=LANG[currentLang];log(s.analyzing,'info');showToast(s.analyzing);
  correlations=[];const nBytes=traces[0].length;const recovered=[];
  for(let byteIdx=0;byteIdx<nBytes;byteIdx++){
    let bestCorr=-1,bestKey=0;const byteCorrs=[];
    for(let guess=0;guess<256;guess++){
      const hyp=plaintexts.map(pt=>hammingWeight(SBOX[pt[byteIdx]^guess]));
      const measured=traces.map(t=>t[byteIdx]);
      const r=pearson(hyp,measured);byteCorrs.push(r);
      if(r>bestCorr){bestCorr=r;bestKey=guess}
    }
    correlations.push(byteCorrs);recovered.push(bestKey);
    log(`Byte ${byteIdx}: 0x${bestKey.toString(16).padStart(2,'0')} (corr=${bestCorr.toFixed(4)})`,'success');
  }
  hideToast();
  $('resultsBox').textContent+=`\n\nRecovered key: ${recovered.map(b=>b.toString(16).padStart(2,'0')).join('')}\nOriginal key:  ${$('keyInput').value.replace(/\s/g,'')}\n\n${s.keyRecovered}`;
  drawCanvas()
}

function pearson(x,y){
  const n=x.length;let sx=0,sy=0,sxy=0,sx2=0,sy2=0;
  for(let i=0;i<n;i++){sx+=x[i];sy+=y[i];sxy+=x[i]*y[i];sx2+=x[i]*x[i];sy2+=y[i]*y[i]}
  const num=n*sxy-sx*sy,den=Math.sqrt((n*sx2-sx*sx)*(n*sy2-sy*sy));
  return den===0?0:num/den;
}

function drawCanvas(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('AES Side Channel Attack',10,22);

  if(traces.length>0){
    // Draw power traces (top half)
    const traceH=(h-50)/2,traceY=40;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText(`Power Traces (${traces.length} captures)`,10,traceY-4);
    const nPts=traces[0].length,pxPerPt=(w-20)/nPts;
    const maxShow=Math.min(30,traces.length);
    for(let t=0;t<maxShow;t++){
      const alpha=.15+.5*(t/maxShow);ctx.strokeStyle=`rgba(74,222,128,${alpha})`;ctx.lineWidth=1;ctx.beginPath();
      for(let i=0;i<nPts;i++){const val=traces[t][i]/8;const x=10+i*pxPerPt;const y=traceY+traceH/2-val*traceH*.4;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
    }
    // X axis labels
    for(let i=0;i<nPts;i++){ctx.fillStyle=muted;ctx.font='9px monospace';ctx.fillText(`B${i}`,10+i*pxPerPt,traceY+traceH+12)}
  }

  if(correlations.length>0){
    // Draw correlation heatmap (bottom half)
    const corrY=h/2+20,corrH=h/2-30;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('CPA Correlation per Key Guess',10,corrY-4);
    const nBytes=correlations.length;
    for(let b=0;b<nBytes;b++){
      const bw=(w-20)/nBytes;
      // Draw correlation curve for this byte
      const maxCorr=Math.max(...correlations[b]);const bestGuess=correlations[b].indexOf(maxCorr);
      ctx.fillStyle=accent;ctx.font='9px monospace';ctx.fillText(`B${b}:0x${bestGuess.toString(16).padStart(2,'0')}`,10+b*bw,corrY+12);
      // Mini bar chart
      for(let g=0;g<256;g++){
        const x=10+b*bw+(g/256)*bw;const ch=correlations[b][g]*corrH*.6;
        ctx.fillStyle=g===bestGuess?'#f87171':`${accent}22`;ctx.fillRect(x,corrY+corrH-ch,Math.max(1,bw/256),ch);
      }
    }
  }
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'S-Box',p:s.wiki_sbox},{t:'Hamming Weight',p:s.wiki_hamming},{t:'CPA',p:s.wiki_cpa}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'S-Box',p:LANG[currentLang].wiki_sbox},{t:'Hamming Weight',p:LANG[currentLang].wiki_hamming},{t:'CPA',p:LANG[currentLang].wiki_cpa}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-aes-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-aes-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('captureBtn').onclick=captureTraces;$('analyzeBtn').onclick=analyzeCPA;$('stopBtn').onclick=()=>{running=false;hideToast()};
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()
});

/* ═══════ ENHANCED AES SIDE-CHANNEL VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0;

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();
function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === S-Box Visualization (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('AES S-Box (16x16)',10,16);
  const sW=w*0.38,sH=130,sX=10,sY=24;
  const cellW=sW/16,cellH=sH/16;
  for(let i=0;i<16;i++){
    for(let j=0;j<16;j++){
      const idx=i*16+j;
      const val=SBOX[idx];
      const hw=hammingWeight(val);
      const intensity=hw/8;
      const isActive=idx===(_t%256);
      _x.fillStyle=isActive?'#f87171':`rgba(${Math.floor(intensity*200)+30},${Math.floor((1-intensity)*150)+40},${100},${intensity*0.6+0.1})`;
      _x.fillRect(sX+j*cellW,sY+i*cellH,cellW-0.5,cellH-0.5);
    }
  }
  // Active cell label
  const activeIdx=_t%256;
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`S[0x${activeIdx.toString(16).padStart(2,'0')}] = 0x${SBOX[activeIdx].toString(16).padStart(2,'0')}  HW=${hammingWeight(SBOX[activeIdx])}`,sX,sY+sH+12);

  // === Hamming Weight Distribution (top-right) ===
  const hwX=w*0.42,hwY=6;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('S-Box Hamming Weight Distribution',hwX,16);
  const hwW=w*0.56,hwH=130;
  const hwDist=new Array(9).fill(0);
  for(let i=0;i<256;i++)hwDist[hammingWeight(SBOX[i])]++;
  const maxHW=Math.max(...hwDist);
  const barW=hwW/9;
  for(let hw=0;hw<=8;hw++){
    const barH=(hwDist[hw]/maxHW)*hwH*0.8;
    const color=`hsl(${hw*30+120},60%,50%)`;
    _x.fillStyle=color+'44';_x.fillRect(hwX+hw*barW+5,hwY+18+hwH-barH,barW-10,barH);
    _x.fillStyle=color;_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(`HW=${hw}`,hwX+hw*barW+barW/2,hwY+hwH+22);
    _x.fillText(`${hwDist[hw]}`,hwX+hw*barW+barW/2,hwY+18+hwH-barH-4);
    _x.textAlign='left';
  }

  // === Simulated Power Trace (middle) ===
  const ptY=sY+sH+28,ptH=60,ptW=w-20;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Simulated Power Trace (single encryption)',10,ptY);

  // Generate a fake power trace with S-box lookups visible
  _x.strokeStyle='#4ade80';_x.lineWidth=1.5;_x.beginPath();
  const traceLen=200;
  for(let i=0;i<traceLen;i++){
    const x=10+i*(ptW/traceLen);
    const sboxPoint=(i%25)===12;
    const baseNoise=(Math.sin(i*0.3+_t*0.05)*2+Math.random()*1.5);
    const sboxSpike=sboxPoint?hammingWeight(SBOX[(_t+i)&0xFF])*2:0;
    const y=ptY+12+ptH/2-(baseNoise+sboxSpike)*3;
    if(i===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  }
  _x.stroke();_x.lineWidth=1;

  // Mark S-box lookup points
  for(let i=0;i<traceLen;i++){
    if((i%25)===12){
      const x=10+i*(ptW/traceLen);
      _x.strokeStyle='#f8717144';_x.beginPath();_x.moveTo(x,ptY+10);_x.lineTo(x,ptY+10+ptH);_x.stroke();
    }
  }
  _x.fillStyle=mut;_x.font='8px SF Mono';_x.fillText('S-box lookup spikes marked in red',10,ptY+ptH+20);

  // === CPA Correlation Matrix (bottom) ===
  const cpY=ptY+ptH+30,cpW=w-20,cpH=h-cpY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('CPA Correlation: 256 key guesses x 16 byte positions',10,cpY);

  const corrCols=Math.min(128,Math.floor(cpW/3)),corrRows=16;
  const corrCW=cpW/corrCols,corrCH=Math.min(cpH/corrRows-0.5,(cpH-15)/corrRows);
  for(let i=0;i<corrRows;i++){
    for(let j=0;j<corrCols;j++){
      // Simulated correlation: correct key byte should have highest correlation
      const correctKey=(0xA5+i*0x11)&0xFF;
      const guess=Math.floor(j*256/corrCols);
      const dist=Math.abs(guess-correctKey);
      const corr=Math.exp(-dist*dist/800)+Math.sin(_t*0.02+i+j*0.1)*0.05;
      const isCorrect=dist<2;
      _x.fillStyle=isCorrect?`rgba(248,113,113,${corr})`:`rgba(96,165,250,${corr*0.5})`;
      _x.fillRect(10+j*corrCW,cpY+8+i*corrCH,corrCW-0.5,corrCH-0.5);
    }
    // Byte label
    _x.fillStyle=mut;_x.font='7px SF Mono';
    _x.fillText(`B${i}`,cpW+14,cpY+8+i*corrCH+corrCH/2+2);
  }
  _x.fillStyle='#f87171';_x.font='8px SF Mono';
  _x.fillText('Correct key bytes show peak correlation (red columns)',10,cpY+8+corrRows*corrCH+12);

  requestAnimationFrame(draw);
}
draw();
})();
