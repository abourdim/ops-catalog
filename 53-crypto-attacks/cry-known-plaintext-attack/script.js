/**
 * Known Plaintext Attack — Workshop DIY v1.0
 * XOR known plaintext with ciphertext to recover key stream
 */
const $=id=>document.getElementById(id);const LANG={en:{title:'Known Plaintext Attack',subtitle:'Recover encryption keys using known pairs',mainSection:'KPA Key Recovery',mainDesc:'XOR known plaintext with ciphertext to recover key stream',ready:'Ready',langChanged:'Language -> English',themeChanged:'Theme ->',recovered:'Key stream recovered!',faq_q1:'What is a known-plaintext attack?',faq_a1:'When the attacker has both plaintext and its ciphertext, they can XOR them to extract the key or key stream.',faq_q2:'Which ciphers are vulnerable?',faq_a2:'Stream ciphers and XOR-based ciphers. Block ciphers in proper modes (CBC with IV) resist this.',faq_q3:'Why does XOR work?',faq_a3:'If C = P XOR K, then K = C XOR P. XOR is its own inverse.',
    faq_q4:'Is my data private?', faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere. Your experiments stay on your device.',howto_1:'Enter the known plaintext.',howto_2:'Click Encrypt to see the ciphertext.',howto_3:'Click Recover Key to XOR plaintext with ciphertext.',howto_4:'Use the recovered key to decrypt unknown messages.',wiki_xor:'XOR cipher: C = P XOR K. Simplest stream cipher.',wiki_stream:'Stream ciphers generate a pseudo-random key stream. If any plaintext-ciphertext pair is known, the key stream is revealed.',wiki_defense:'Defense: never reuse key streams (nonces), use authenticated encryption (AES-GCM).',mathExplain:'Known Plaintext Attack on XOR Cipher:\n\nEncryption: C = P XOR K\nGiven: P (known plaintext), C (ciphertext)\nRecover: K = C XOR P\n\nDecrypt any message: P2 = C2 XOR K\n\nFor repeating-key XOR:\nC[i] = P[i] XOR K[i mod keylen]\nK[i mod keylen] = C[i] XOR P[i]',step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.'},
fr:{title:'Attaque Texte Clair Connu',subtitle:'Recuperez les cles avec des paires connues',mainSection:'Recuperation de Cle',mainDesc:'XOR du texte connu avec le chiffre',ready:'Pret',langChanged:'Langue -> Francais',themeChanged:'Theme ->',recovered:'Flux de cle recupere!',faq_q1:'Attaque texte clair connu?',faq_a1:'Avec le texte clair et le chiffre, XOR extrait la cle.',faq_q2:'Quels chiffrements?',faq_a2:'Chiffrements par flux et XOR.',faq_q3:'Pourquoi XOR?',faq_a3:'Si C=P XOR K, alors K=C XOR P.',
    faq_q4:'Mes données sont-elles privées ?', faq_a4:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée nulle part.',howto_1:'Entrez le texte connu.',howto_2:'Cliquez Chiffrer.',howto_3:'Cliquez Recuperer.',howto_4:'Dechiffrez d\'autres messages.',wiki_xor:'XOR: C = P XOR K.',wiki_stream:'Les chiffrements par flux generent un flux pseudo-aleatoire.',wiki_defense:'Defense: ne jamais reutiliser les flux de cles.',mathExplain:'C = P XOR K\nK = C XOR P',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.'},
ar:{title:'هجوم النص المعروف',subtitle:'استرجع مفاتيح التشفير باستخدام أزواج معروفة',mainSection:'استرجاع المفتاح',mainDesc:'XOR النص المعروف مع المشفر لاسترجاع تيار المفتاح',ready:'جاهز',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',recovered:'تم استرجاع تيار المفتاح!',faq_q1:'ما هو هجوم النص المعروف؟',faq_a1:'عندما يملك المهاجم النص الأصلي والمشفر، يمكنه استخراج المفتاح بـ XOR.',faq_q2:'أي تشفيرات معرضة؟',faq_a2:'تشفير التدفق و XOR.',faq_q3:'لماذا XOR؟',faq_a3:'إذا C=P XOR K، فإن K=C XOR P.',
    faq_q4:'هل بياناتي خاصة؟', faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك. لا يتم إرسال أي بيانات إلى أي مكان.',howto_1:'أدخل النص المعروف.',howto_2:'اضغط تشفير.',howto_3:'اضغط استرجاع.',howto_4:'فك تشفير رسائل أخرى.',wiki_xor:'XOR: C = P XOR K.',wiki_stream:'تشفير التدفق يولد تيارا شبه عشوائي.',wiki_defense:'الدفاع: لا تعد استخدام تيارات المفاتيح.',mathExplain:'C = P XOR K\nK = C XOR P',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.'}};
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-kpa-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-kpa-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}
/* ═══════ XOR CIPHER ═══════ */
let secretKey='SECRETKEY',ptBytes=[],ctBytes=[],keyBytes=[],recoveredKey=[];
function xorEncrypt(pt,key){return pt.map((b,i)=>b^key.charCodeAt(i%key.length))}
function doEncrypt(){const pt=$('ptInput').value;ptBytes=Array.from(pt).map(c=>c.charCodeAt(0));ctBytes=xorEncrypt(ptBytes,secretKey);keyBytes=Array.from(secretKey).map(c=>c.charCodeAt(0));recoveredKey=[];
  $('resultsBox').textContent=`Plaintext:  "${pt}"\nCiphertext: [${ctBytes.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\n(Key is hidden from attacker)`;log('Encrypted with secret key','success');drawCanvas()}
function recoverKey(){if(ctBytes.length===0){doEncrypt()}recoveredKey=ctBytes.map((c,i)=>c^ptBytes[i]);
  const keyStr=recoveredKey.map(b=>String.fromCharCode(b)).join('');const s=LANG[currentLang];
  $('resultsBox').textContent+=`\n\n--- KEY RECOVERY ---\nRecovered key bytes: [${recoveredKey.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\nRecovered key: "${keyStr}"\nActual key:    "${secretKey}"\nMatch: ${keyStr.slice(0,secretKey.length)===secretKey?'YES':'PARTIAL'}`;
  log(s.recovered,'success');drawCanvas()}
function decryptUnknown(){if(recoveredKey.length===0){recoverKey()}const ct2=$('unknownInput').value.split(' ').map(h=>parseInt(h,16)).filter(n=>!isNaN(n));
  if(ct2.length===0){log('Enter hex ciphertext','error');return}
  const pt2=ct2.map((c,i)=>String.fromCharCode(c^recoveredKey[i%recoveredKey.length])).join('');
  $('resultsBox').textContent+=`\n\nDecrypted unknown: "${pt2}"`;log(`Decrypted: "${pt2}"`,'success');drawCanvas()}
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;const accent=getCS('--accent'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Known Plaintext XOR Attack',10,22);
  if(ptBytes.length===0)return;const cellW=Math.min(40,(w-20)/ptBytes.length),rowH=45,startY=50;
  // Plaintext row
  ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Known Plaintext (P)',10,startY-4);
  ptBytes.forEach((b,i)=>{ctx.fillStyle='#4ade8033';ctx.fillRect(10+i*cellW,startY,cellW-2,rowH-5);ctx.fillStyle='#4ade80';ctx.font='9px monospace';ctx.fillText(String.fromCharCode(b),14+i*cellW,startY+15);ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,startY+30)});
  // Ciphertext row
  const ctY=startY+rowH+10;ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Ciphertext (C)',10,ctY-4);
  ctBytes.forEach((b,i)=>{ctx.fillStyle=`${accent}33`;ctx.fillRect(10+i*cellW,ctY,cellW-2,rowH-5);ctx.fillStyle=accent;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,ctY+20)});
  // XOR arrows
  const xorY=ctY+rowH+5;ctx.fillStyle='#f87171';ctx.font='bold 12px monospace';ptBytes.forEach((_,i)=>{ctx.fillText('XOR',12+i*cellW,xorY+10)});
  // Recovered key row
  const keyY=xorY+25;ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Recovered Key (K = P XOR C)',10,keyY-4);
  (recoveredKey.length?recoveredKey:new Array(ptBytes.length).fill(null)).forEach((b,i)=>{
    ctx.fillStyle=b!==null?'#f8717133':'rgba(255,255,255,.05)';ctx.fillRect(10+i*cellW,keyY,cellW-2,rowH-5);
    if(b!==null){ctx.fillStyle='#f87171';ctx.font='bold 10px monospace';ctx.fillText(String.fromCharCode(b),14+i*cellW,keyY+15);ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,keyY+30)}})}
function buildControls(){$('controlsArea').innerHTML=`<div class="control-section"><div class="section-header"><div class="section-title">Known Plaintext</div></div><input type="text" id="ptInput" value="Hello, World! This is a known message." placeholder="Known plaintext"/></div><div class="control-section"><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="encBtn" class="primary" style="flex:1">Encrypt</button><button id="recoverBtn" style="flex:1">Recover Key (XOR)</button></div></div><div class="control-section"><div class="section-header"><div class="section-title">Unknown Ciphertext (hex, space-separated)</div></div><input type="text" id="unknownInput" placeholder="e.g. 1b 0a 1c ..."/><button id="decBtn" class="btn-sm" style="margin-top:6px">Decrypt Unknown</button></div>`;
  $('encBtn').onclick=doEncrypt;$('recoverBtn').onclick=recoverKey;$('decBtn').onclick=decryptUnknown}
function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'XOR',p:s.wiki_xor},{t:'Stream',p:s.wiki_stream},{t:'Defense',p:s.wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'XOR',p:LANG[currentLang].wiki_xor},{t:'Stream',p:LANG[currentLang].wiki_stream},{t:'Defense',p:LANG[currentLang].wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-kpa-lang');if(l&&LANG[l])setLanguage(l)}catch{}try{const t=localStorage.getItem('cry-kpa-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};$('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  buildControls();buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED KPA VISUALIZATION (IIFE) ═══════ */
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

  // === XOR Truth Table (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('XOR Operation Properties',10,16);

  const ttW=w*0.3;
  const rows=[['A','B','A^B'],['0','0','0'],['0','1','1'],['1','0','1'],['1','1','0']];
  rows.forEach((row,i)=>{
    const y=24+i*16;
    const isHeader=i===0;
    row.forEach((cell,j)=>{
      const x=10+j*(ttW/3);
      _x.fillStyle=isHeader?acc+'44':'rgba(255,255,255,.03)';
      _x.fillRect(x,y,ttW/3-2,14);
      _x.fillStyle=isHeader?acc:cell==='1'?'#4ade80':'#f87171';
      _x.font=isHeader?'bold 9px SF Mono':'9px SF Mono';_x.textAlign='center';
      _x.fillText(cell,x+ttW/6,y+11);_x.textAlign='left';
    });
  });
  // Key property
  _x.fillStyle='#fbbf24';_x.font='bold 9px SF Mono';
  _x.fillText('P XOR K = C',10,110);
  _x.fillText('C XOR P = K',10,124);
  _x.fillText('C XOR K = P',10,138);
  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('XOR is self-inverse!',10,154);

  // === Binary XOR Animation (top-middle) ===
  const bxX=w*0.33,bxW=w*0.34;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Byte-level XOR Recovery',bxX,16);

  const animByte=(_t%8);
  const plainByte=0x48+animByte;// 'H','e','l','l','o'...
  const keyByte=0x53+animByte;
  const cipherByte=plainByte^keyByte;

  for(let bit=7;bit>=0;bit--){
    const x=bxX+(7-bit)*18;
    const pBit=(plainByte>>bit)&1;
    const kBit=(keyByte>>bit)&1;
    const cBit=(cipherByte>>bit)&1;
    // Plaintext bit
    _x.fillStyle=pBit?'#4ade8066':'rgba(255,255,255,.05)';
    _x.fillRect(x,28,16,16);_x.fillStyle=pBit?'#4ade80':mut;_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(pBit.toString(),x+8,40);
    // XOR symbol
    _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';_x.fillText('\u2295',x+8,58);
    // Key bit
    _x.fillStyle=kBit?'#f8717166':'rgba(255,255,255,.05)';
    _x.fillRect(x,64,16,16);_x.fillStyle=kBit?'#f87171':mut;_x.font='bold 9px SF Mono';
    _x.fillText(kBit.toString(),x+8,76);
    // Equals
    _x.fillStyle=mut;_x.font='bold 10px SF Mono';_x.fillText('=',x+8,94);
    // Cipher bit
    _x.fillStyle=cBit?'#60a5fa66':'rgba(255,255,255,.05)';
    _x.fillRect(x,100,16,16);_x.fillStyle=cBit?'#60a5fa':mut;_x.font='bold 9px SF Mono';
    _x.fillText(cBit.toString(),x+8,112);
    _x.textAlign='left';
  }

  // Labels
  _x.fillStyle='#4ade80';_x.font='8px SF Mono';_x.fillText(`P=0x${plainByte.toString(16)}='${String.fromCharCode(plainByte)}'`,bxX,126);
  _x.fillStyle='#f87171';_x.fillText(`K=0x${keyByte.toString(16)}`,bxX+80,126);
  _x.fillStyle='#60a5fa';_x.fillText(`C=0x${cipherByte.toString(16)}`,bxX+140,126);

  // === Key Stream Reuse Vulnerability (top-right) ===
  const krX=w*0.68,krW=w*0.3;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Key Reuse Attack',krX,16);

  _x.fillStyle='#f87171';_x.font='9px SF Mono';
  _x.fillText('If K reused:',krX,30);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('C1 = P1 ^ K',krX,44);
  _x.fillText('C2 = P2 ^ K',krX,58);
  _x.fillText('C1^C2 = P1^P2',krX,76);
  _x.fillStyle='#fbbf24';_x.font='bold 8px SF Mono';
  _x.fillText('Key cancels out!',krX,92);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('If P1 known:',krX,110);
  _x.fillText('P2 = C1^C2^P1',krX,124);
  _x.fillStyle='#4ade80';_x.font='bold 8px SF Mono';
  _x.fillText('All messages exposed!',krX,140);

  // === Frequency Analysis (bottom-left) ===
  const faY=164,faW=w*0.48,faH=h-faY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Ciphertext Frequency Analysis (XOR cipher)',10,faY);

  // Generate frequency data for a simple XOR cipher
  const msg='The quick brown fox jumps over the lazy dog. Crypto is fun!';
  const key='KEY';
  const freq=new Array(256).fill(0);
  for(let i=0;i<msg.length;i++){
    const c=msg.charCodeAt(i)^key.charCodeAt(i%key.length);
    freq[c]++;
  }
  const maxFreq=Math.max(...freq,1);
  const barW=faW/128;
  for(let i=0;i<128;i++){
    if(freq[i]>0){
      const barH=(freq[i]/maxFreq)*(faH-20);
      const hue=(i/128)*360;
      _x.fillStyle=`hsla(${hue},60%,50%,.5)`;
      _x.fillRect(10+i*barW,faY+10+faH-20-barH,barW-1,barH);
    }
  }
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('Non-uniform distribution reveals patterns',10,faY+faH-2);

  // === Stream Cipher Architecture (bottom-right) ===
  const scX=w*0.52,scY=faY,scW=w*0.46,scH=faH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Stream Cipher Key Stream',scX,scY);

  // PRNG box
  _x.fillStyle='#c084fc33';_x.fillRect(scX,scY+12,80,35);_x.strokeStyle='#c084fc';_x.strokeRect(scX,scY+12,80,35);
  _x.fillStyle='#c084fc';_x.font='bold 9px SF Mono';_x.textAlign='center';
  _x.fillText('PRNG',scX+40,scY+25);
  _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText('(seed=key)',scX+40,scY+38);_x.textAlign='left';

  // Key stream output
  const ksY=scY+55;
  const streamLen=Math.min(16,Math.floor(scW/22));
  for(let i=0;i<streamLen;i++){
    const x=scX+i*22;
    const val=((0xAB*(_t+i)+0x37)&0xFF);
    const active=i<=(_t%streamLen);
    _x.fillStyle=active?'#c084fc33':'rgba(255,255,255,.03)';
    _x.fillRect(x,ksY,20,16);
    if(active){_x.fillStyle='#c084fc';_x.font='bold 7px SF Mono';_x.textAlign='center';_x.fillText(val.toString(16),x+10,ksY+12);_x.textAlign='left'}
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('Key stream bytes',scX,ksY+28);

  // XOR with plaintext
  const xorY=ksY+35;
  _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';
  for(let i=0;i<Math.min(streamLen,8);i++){
    _x.fillText('\u2295',scX+i*22+6,xorY+10);
  }

  // Plaintext row
  const ptY=xorY+18;
  for(let i=0;i<Math.min(streamLen,8);i++){
    const x=scX+i*22;
    const ch=msg.charCodeAt(i);
    _x.fillStyle='#4ade8033';_x.fillRect(x,ptY,20,16);
    _x.fillStyle='#4ade80';_x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(ch.toString(16),x+10,ptY+12);_x.textAlign='left';
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('= Ciphertext',scX,ptY+28);

  // Defense note
  const defY=ptY+38;
  if(defY+15<h){
    _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';
    _x.fillText('Defense: Never reuse nonce/key (AES-GCM, ChaCha20-Poly1305)',scX,defY);
  }

  requestAnimationFrame(draw);
}
draw();
})();
