/**
 * Padding Oracle Lab — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas Sim
 */
const $=id=>document.getElementById(id);
const LANG={
  en:{title:'Padding Oracle Lab',subtitle:'Exploit CBC padding oracle to decrypt byte-by-byte',mainSection:'Padding Oracle Attack',mainDesc:'Simulate padding oracle on AES-CBC',ptLabel:'Secret Plaintext',ptHint:'This message will be encrypted; try to recover it',encrypt:'Encrypt',startAttack:'Start Attack',stop:'Stop',results:'Results',vizTitle:'Attack Visualization',vizHint:'Watch the oracle leak plaintext byte by byte',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',encrypted:'Message encrypted',attacking:'Attacking...',decrypted:'Decrypted!',padValid:'Padding valid',padInvalid:'Padding invalid',
    faq_q1:'What is a padding oracle?',faq_a1:'A server that reveals whether decrypted ciphertext has valid PKCS#7 padding. This tiny leak allows full decryption.',faq_q2:'How does the attack work?',faq_a2:'By modifying the previous ciphertext block and checking padding validity, the attacker can deduce each plaintext byte.',faq_q3:'Is this attack real?',faq_a3:'Yes! This was used against ASP.NET, TLS, and many other systems. It is the reason PKCS#7 padding must be authenticated.',
    howto_1:'Enter a secret message.',howto_2:'Click Encrypt to create the ciphertext.',howto_3:'Click Start Attack to begin byte-by-byte decryption.',howto_4:'Watch the canvas as each byte is recovered.',
    wiki_cbc:'CBC mode XORs each plaintext block with the previous ciphertext block before encryption.',wiki_pkcs7:'PKCS#7 padding fills the last block: if 3 bytes remain, pad with 03 03 03.',wiki_oracle:'The oracle returns true/false for valid padding, leaking information about the decrypted intermediate value.',
    mathExplain:'Padding Oracle Attack:\n\nC = IV || C1 || C2 || ... || Cn\nD(Ck) = Ik (intermediate value)\nPk = Ck-1 XOR Ik\n\nAttacker modifies Ck-1 byte by byte:\nFor each guess g (0..255):\n  Set Ck-1[last] = g\n  If oracle says valid padding:\n    Ik[last] = g XOR 0x01\n    Pk[last] = original_Ck-1[last] XOR Ik[last]\n\nRepeat for all bytes, all blocks.'},
  fr:{title:'Labo Oracle de Rembourrage',subtitle:'Exploitez l\'oracle de rembourrage CBC',mainSection:'Attaque Oracle',mainDesc:'Simulez l\'attaque sur AES-CBC',ptLabel:'Texte Clair Secret',ptHint:'Ce message sera chiffre; essayez de le recuperer',encrypt:'Chiffrer',startAttack:'Lancer Attaque',stop:'Arreter',results:'Resultats',vizTitle:'Visualisation',vizHint:'Regardez l\'oracle reveler le texte octet par octet',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',encrypted:'Message chiffre',attacking:'Attaque en cours...',decrypted:'Dechiffre!',padValid:'Rembourrage valide',padInvalid:'Rembourrage invalide',
    faq_q1:'Qu\'est-ce qu\'un oracle de rembourrage?',faq_a1:'Un serveur qui revele si le dechiffrement a un rembourrage PKCS#7 valide.',faq_q2:'Comment fonctionne l\'attaque?',faq_a2:'En modifiant le bloc precedent et verifiant le rembourrage, l\'attaquant deduit chaque octet.',faq_q3:'Attaque reelle?',faq_a3:'Oui! Utilisee contre ASP.NET, TLS et d\'autres systemes.',
    howto_1:'Entrez un message secret.',howto_2:'Cliquez Chiffrer.',howto_3:'Cliquez Lancer Attaque.',howto_4:'Regardez la recuperation.',
    wiki_cbc:'Le mode CBC XOR chaque bloc avec le bloc chiffre precedent.',wiki_pkcs7:'PKCS#7: si 3 octets restent, remplir avec 03 03 03.',wiki_oracle:'L\'oracle repond vrai/faux pour le rembourrage.',
    mathExplain:'Attaque Oracle de Rembourrage:\n\nC = IV || C1 || C2\nD(Ck) = Ik\nPk = Ck-1 XOR Ik\n\nModifier Ck-1 octet par octet pour deduire Ik.'},
  ar:{title:'مختبر هجوم الحشو',subtitle:'استغل هجوم الحشو لفك التشفير بايت ببايت',mainSection:'هجوم أوراكل الحشو',mainDesc:'حاكي هجوم الحشو على AES-CBC',ptLabel:'النص السري',ptHint:'سيتم تشفير هذه الرسالة، حاول استرجاعها',encrypt:'تشفير',startAttack:'بدء الهجوم',stop:'إيقاف',results:'النتائج',vizTitle:'تصور الهجوم',vizHint:'شاهد الأوراكل يسرّب النص بايت ببايت',sectionA:'مرجع الهجوم',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',encrypted:'تم التشفير',attacking:'جاري الهجوم...',decrypted:'تم فك التشفير!',padValid:'حشو صالح',padInvalid:'حشو غير صالح',
    faq_q1:'ما هو أوراكل الحشو؟',faq_a1:'خادم يكشف ما إذا كان الحشو PKCS#7 صحيحا بعد فك التشفير.',faq_q2:'كيف يعمل الهجوم؟',faq_a2:'بتعديل كتلة النص المشفر السابقة والتحقق من صحة الحشو.',faq_q3:'هل الهجوم حقيقي؟',faq_a3:'نعم! استُخدم ضد ASP.NET وTLS وأنظمة أخرى.',
    howto_1:'أدخل رسالة سرية.',howto_2:'اضغط تشفير.',howto_3:'اضغط بدء الهجوم.',howto_4:'شاهد استرجاع كل بايت.',
    wiki_cbc:'وضع CBC يطبق XOR على كل كتلة مع الكتلة المشفرة السابقة.',wiki_pkcs7:'PKCS#7: إذا بقيت 3 بايتات، املأ بـ 03 03 03.',wiki_oracle:'الأوراكل يرد صحيح/خطأ للحشو.',
    mathExplain:'هجوم أوراكل الحشو:\n\nC = IV || C1 || C2\nD(Ck) = Ik\nPk = Ck-1 XOR Ik\n\nعدّل Ck-1 بايت ببايت لاستنتاج Ik.'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-pad-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-pad-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const t=audioCtx.currentTime;if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3)}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.25)}}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ═══════ SIMULATED CBC ENCRYPTION ═══════ */
let cipherBlocks=[],ivBlock=[],secretKey=[],blockSize=8,running=false,recoveredBytes=[],currentByteIdx=-1,currentGuess=0;
function randBytes(n){const a=[];for(let i=0;i<n;i++)a.push(Math.floor(Math.random()*256));return a}
function xorBlocks(a,b){return a.map((v,i)=>v^b[i])}
function simpleBlockEncrypt(block,key){return block.map((v,i)=>(v+key[i%key.length]+37)&0xff)}
function simpleBlockDecrypt(block,key){return block.map((v,i)=>(v-key[i%key.length]-37+512)&0xff)}
function pkcs7Pad(data){const pad=blockSize-(data.length%blockSize);const r=[...data];for(let i=0;i<pad;i++)r.push(pad);return r}
function checkPadding(block){const last=block[block.length-1];if(last<1||last>blockSize)return false;for(let i=0;i<last;i++)if(block[block.length-1-i]!==last)return false;return true}

function doEncrypt(){
  const pt=$('ptInput').value;const bytes=Array.from(pt).map(c=>c.charCodeAt(0));
  const padded=pkcs7Pad(bytes);secretKey=randBytes(blockSize);ivBlock=randBytes(blockSize);cipherBlocks=[];
  let prev=ivBlock;
  for(let i=0;i<padded.length;i+=blockSize){const block=padded.slice(i,i+blockSize);const xored=xorBlocks(block,prev);const enc=simpleBlockEncrypt(xored,secretKey);cipherBlocks.push(enc);prev=enc}
  recoveredBytes=[];currentByteIdx=-1;currentGuess=0;
  const s=LANG[currentLang];log(s.encrypted,'success');
  $('resultsBox').textContent=`IV: [${ivBlock.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\nBlocks: ${cipherBlocks.length}\nCiphertext: [${cipherBlocks.flat().map(b=>b.toString(16).padStart(2,'0')).join(' ')}]`;
  drawCanvas()
}

function paddingOracle(modifiedPrev,cipherBlock){
  const decrypted=simpleBlockDecrypt(cipherBlock,secretKey);const result=xorBlocks(decrypted,modifiedPrev);return checkPadding(result)
}

function startAttack(){
  if(cipherBlocks.length===0){doEncrypt()}
  running=true;recoveredBytes=new Array(cipherBlocks.length*blockSize).fill(null);
  const s=LANG[currentLang];log(s.attacking,'info');showToast(s.attacking);
  let blockIdx=0,bytePos=blockSize-1,intermediateValues=new Array(blockSize).fill(0);
  function attackStep(){
    if(!running)return;
    const prevBlock=blockIdx===0?ivBlock:cipherBlocks[blockIdx-1];const currBlock=cipherBlocks[blockIdx];
    const padVal=blockSize-bytePos;const modified=[...prevBlock];
    // Set already-known bytes
    for(let i=blockSize-1;i>bytePos;i--)modified[i]=intermediateValues[i]^padVal;
    modified[bytePos]=currentGuess;
    const globalIdx=blockIdx*blockSize+bytePos;
    if(paddingOracle(modified,currBlock)){
      intermediateValues[bytePos]=currentGuess^padVal;
      const plainByte=prevBlock[bytePos]^intermediateValues[bytePos];
      recoveredBytes[globalIdx]=plainByte;
      log(`Byte ${globalIdx}: 0x${plainByte.toString(16).padStart(2,'0')} = '${plainByte>=32&&plainByte<127?String.fromCharCode(plainByte):'.'}'`,'success');
      currentGuess=0;bytePos--;
      if(bytePos<0){blockIdx++;bytePos=blockSize-1;intermediateValues=new Array(blockSize).fill(0);
        if(blockIdx>=cipherBlocks.length){running=false;hideToast();const recovered=recoveredBytes.filter(b=>b!==null).map(b=>b>=32&&b<127?String.fromCharCode(b):'.').join('');
          $('resultsBox').textContent+=`\n\nRecovered: "${recovered}"\n\n${s.decrypted}`;log(s.decrypted,'success');drawCanvas();return}
      }
    }else{currentGuess++;if(currentGuess>255){log('Byte exhausted, skipping','error');currentGuess=0;bytePos--;
      if(bytePos<0){blockIdx++;bytePos=blockSize-1;intermediateValues=new Array(blockSize).fill(0);if(blockIdx>=cipherBlocks.length){running=false;hideToast();drawCanvas();return}}
    }}
    drawCanvas();setTimeout(attackStep,5)
  }
  attackStep()
}

/* ═══════ CANVAS ═══════ */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Padding Oracle Attack',10,22);
  // Draw blocks
  const totalBytes=cipherBlocks.length*blockSize;if(totalBytes===0)return;
  const cellW=Math.min(40,(w-20)/totalBytes),cellH=40,startY=50;
  // IV
  ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('IV',10,startY-4);
  ivBlock.forEach((b,i)=>{ctx.fillStyle=`${accent}22`;ctx.fillRect(10+i*cellW,startY,cellW-2,cellH);ctx.fillStyle=muted;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),12+i*cellW,startY+25)});
  // Cipher blocks
  ctx.fillStyle=muted;ctx.fillText('Ciphertext',10,startY+cellH+14);
  cipherBlocks.flat().forEach((b,i)=>{ctx.fillStyle=`${accent}22`;ctx.fillRect(10+i*cellW,startY+cellH+20,cellW-2,cellH);ctx.fillStyle=muted;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),12+i*cellW,startY+cellH+45)});
  // Recovered plaintext
  ctx.fillStyle=accent;ctx.fillText('Recovered Plaintext',10,startY+2*cellH+50);
  recoveredBytes.forEach((b,i)=>{
    const isRecovered=b!==null;ctx.fillStyle=isRecovered?`${accent}44`:'rgba(255,255,255,.05)';
    ctx.fillRect(10+i*cellW,startY+2*cellH+56,cellW-2,cellH);
    if(isRecovered){ctx.fillStyle=accent;ctx.font='bold 11px monospace';const ch=b>=32&&b<127?String.fromCharCode(b):'.';ctx.fillText(ch,14+i*cellW,startY+2*cellH+80)}
  });
  // Progress
  const recovered=recoveredBytes.filter(b=>b!==null).length;const pct=totalBytes>0?(recovered/totalBytes*100).toFixed(0):0;
  ctx.fillStyle=text;ctx.font='12px Tajawal';ctx.fillText(`Progress: ${recovered}/${totalBytes} bytes (${pct}%)`,10,startY+3*cellH+80);
  // Query visualization
  if(running){ctx.fillStyle='#f8717144';const qy=startY+3*cellH+95;ctx.fillRect(10,qy,w-20,30);ctx.fillStyle='#f87171';ctx.font='11px monospace';ctx.fillText(`Trying byte guess: 0x${currentGuess.toString(16).padStart(2,'0')} (${currentGuess}/255)`,14,qy+20);
    const bar=(currentGuess/255)*(w-24);ctx.fillStyle='#f8717166';ctx.fillRect(12,qy+24,bar,4)}
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'CBC Mode',p:s.wiki_cbc},{t:'PKCS#7',p:s.wiki_pkcs7},{t:'Padding Oracle',p:s.wiki_oracle}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'CBC',p:LANG[currentLang].wiki_cbc},{t:'PKCS#7',p:LANG[currentLang].wiki_pkcs7},{t:'Oracle',p:LANG[currentLang].wiki_oracle}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-pad-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-pad-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('encryptBtn').onclick=doEncrypt;$('attackBtn').onclick=startAttack;$('stopBtn').onclick=()=>{running=false;hideToast();log('Attack stopped','info')};
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()
});
