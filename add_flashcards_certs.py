#!/usr/bin/env python3
"""Add Flashcard System and Progress Certificate to all 488 ops-catalog apps."""

import os
import re
import glob
import random
import subprocess
import sys

CATALOG = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──────────────────────────────────────────────────────

LANG_EN = (
    "flashTitle:'Flashcards',"
    "flashKnow:'Know it',"
    "flashReview:'Review later',"
    "flashDone:'All cards reviewed!',"
    "flashProgress:'{0} of {1} remaining',"
    "flash_t1:'Signal',"
    "flash_d1:'A detectable transmitted energy pattern used to convey information.',"
    "flash_t2:'Encryption',"
    "flash_d2:'The process of encoding data so only authorized parties can read it.',"
    "flash_t3:'Protocol',"
    "flash_d3:'A set of rules governing data exchange between devices or systems.',"
    "flash_t4:'Frequency',"
    "flash_d4:'The number of cycles per second of a periodic signal, measured in Hertz.',"
    "flash_t5:'Authentication',"
    "flash_d5:'The process of verifying the identity of a user, device, or system.',"
    "certTitle:'Certificate of Completion',"
    "certComplete:'Congratulations! All apps completed!',"
    "certProgress:'{0} of {1} apps completed',"
    "certDownload:'Download Certificate',"
    "certName:'Workshop DIY',"
)

LANG_FR = (
    "flashTitle:'Cartes M\\xe9moire',"
    "flashKnow:'Je sais',"
    "flashReview:'\\xc0 revoir',"
    "flashDone:'Toutes les cartes r\\xe9vis\\xe9es !',"
    "flashProgress:'{0} sur {1} restantes',"
    "flash_t1:'Signal',"
    "flash_d1:'Un motif d\\x27\\xe9nergie transmis d\\xe9tectable utilis\\xe9 pour transmettre des informations.',"
    "flash_t2:'Chiffrement',"
    "flash_d2:'Le processus d\\x27encodage des donn\\xe9es pour que seules les parties autoris\\xe9es puissent les lire.',"
    "flash_t3:'Protocole',"
    "flash_d3:'Un ensemble de r\\xe8gles r\\xe9gissant l\\x27\\xe9change de donn\\xe9es entre appareils ou syst\\xe8mes.',"
    "flash_t4:'Fr\\xe9quence',"
    "flash_d4:'Le nombre de cycles par seconde d\\x27un signal p\\xe9riodique, mesur\\xe9 en Hertz.',"
    "flash_t5:'Authentification',"
    "flash_d5:'Le processus de v\\xe9rification de l\\x27identit\\xe9 d\\x27un utilisateur, appareil ou syst\\xe8me.',"
    "certTitle:'Certificat de R\\xe9ussite',"
    "certComplete:'F\\xe9licitations ! Toutes les apps termin\\xe9es !',"
    "certProgress:'{0} sur {1} apps termin\\xe9es',"
    "certDownload:'T\\xe9l\\xe9charger le Certificat',"
    "certName:'Workshop DIY',"
)

LANG_AR = (
    "flashTitle:'\u0628\u0637\u0627\u0642\u0627\u062a \u062a\u0639\u0644\u064a\u0645\u064a\u0629',"
    "flashKnow:'\u0623\u0639\u0631\u0641\u0647\u0627',"
    "flashReview:'\u0631\u0627\u062c\u0639 \u0644\u0627\u062d\u0642\u0627\u064b',"
    "flashDone:'\u062a\u0645\u062a \u0645\u0631\u0627\u062c\u0639\u0629 \u062c\u0645\u064a\u0639 \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062a!',"
    "flashProgress:'{0} \u0645\u0646 {1} \u0645\u062a\u0628\u0642\u064a\u0629',"
    "flash_t1:'\u0625\u0634\u0627\u0631\u0629',"
    "flash_d1:'\u0646\u0645\u0637 \u0637\u0627\u0642\u0629 \u0645\u0631\u0633\u0644 \u0642\u0627\u0628\u0644 \u0644\u0644\u0643\u0634\u0641 \u064a\u0633\u062a\u062e\u062f\u0645 \u0644\u0646\u0642\u0644 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a.',"
    "flash_t2:'\u062a\u0634\u0641\u064a\u0631',"
    "flash_d2:'\u0639\u0645\u0644\u064a\u0629 \u062a\u0631\u0645\u064a\u0632 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0628\u062d\u064a\u062b \u0644\u0627 \u064a\u0645\u0643\u0646 \u0642\u0631\u0627\u0621\u062a\u0647\u0627 \u0625\u0644\u0627 \u0644\u0644\u0623\u0637\u0631\u0627\u0641 \u0627\u0644\u0645\u0635\u0631\u062d \u0644\u0647\u0627.',"
    "flash_t3:'\u0628\u0631\u0648\u062a\u0648\u0643\u0648\u0644',"
    "flash_d3:'\u0645\u062c\u0645\u0648\u0639\u0629 \u0642\u0648\u0627\u0639\u062f \u062a\u062d\u0643\u0645 \u062a\u0628\u0627\u062f\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0628\u064a\u0646 \u0627\u0644\u0623\u062c\u0647\u0632\u0629.',"
    "flash_t4:'\u062a\u0631\u062f\u062f',"
    "flash_d4:'\u0639\u062f\u062f \u0627\u0644\u062f\u0648\u0631\u0627\u062a \u0641\u064a \u0627\u0644\u062b\u0627\u0646\u064a\u0629 \u0644\u0625\u0634\u0627\u0631\u0629 \u062f\u0648\u0631\u064a\u0629\u060c \u062a\u0642\u0627\u0633 \u0628\u0627\u0644\u0647\u0631\u062a\u0632.',"
    "flash_t5:'\u0645\u0635\u0627\u062f\u0642\u0629',"
    "flash_d5:'\u0639\u0645\u0644\u064a\u0629 \u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0647\u0648\u064a\u0629 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0623\u0648 \u0627\u0644\u062c\u0647\u0627\u0632 \u0623\u0648 \u0627\u0644\u0646\u0638\u0627\u0645.',"
    "certTitle:'\u0634\u0647\u0627\u062f\u0629 \u0625\u062a\u0645\u0627\u0645',"
    "certComplete:'\u062a\u0647\u0627\u0646\u064a\u0646\u0627! \u062a\u0645 \u0625\u0643\u0645\u0627\u0644 \u062c\u0645\u064a\u0639 \u0627\u0644\u062a\u0637\u0628\u064a\u0642\u0627\u062a!',"
    "certProgress:'{0} \u0645\u0646 {1} \u062a\u0637\u0628\u064a\u0642\u0627\u062a \u0645\u0643\u062a\u0645\u0644\u0629',"
    "certDownload:'\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0634\u0647\u0627\u062f\u0629',"
    "certName:'Workshop DIY',"
)

# ── JS functions to inject ────────────────────────────────────────────────────

JS_FUNCTIONS = r"""
/* === FLASHCARD SYSTEM === */
function initFlashcards(){
 if(document.getElementById('flashcardsBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.flashTitle)return;
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 var storageKey='flash_score_'+appDir;
 var cards=[];
 for(var i=1;i<=5;i++){
  var t=L['flash_t'+i];var d=L['flash_d'+i];
  if(t&&d)cards.push({term:t,def:d});
 }
 if(cards.length===0)return;
 var btn=document.createElement('button');
 btn.id='flashcardsBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83c\udccf';
 btn.title=L.flashTitle||'Flashcards';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var deck=cards.slice();
  var known=0;
  var total=deck.length;
  var touchStartX=0;
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='max-width:420px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:0.8rem;font-family:Orbitron,monospace;';
  h3.textContent=L.flashTitle;
  box.appendChild(h3);
  var progBar=document.createElement('div');
  progBar.style.cssText='background:rgba(255,255,255,0.1);border-radius:8px;height:8px;margin-bottom:1rem;overflow:hidden;';
  var progFill=document.createElement('div');
  progFill.style.cssText='height:100%;background:var(--accent,#d4a03c);border-radius:8px;transition:width 0.3s;width:0%;';
  progBar.appendChild(progFill);
  box.appendChild(progBar);
  var progText=document.createElement('div');
  progText.style.cssText='font-size:0.85rem;opacity:0.7;margin-bottom:1rem;';
  box.appendChild(progText);
  var cardWrap=document.createElement('div');
  cardWrap.style.cssText='perspective:800px;margin-bottom:1.2rem;';
  var card=document.createElement('div');
  card.style.cssText='width:100%;min-height:200px;position:relative;transform-style:preserve-3d;transition:transform 0.5s;cursor:pointer;';
  var front=document.createElement('div');
  front.style.cssText='position:absolute;inset:0;backface-visibility:hidden;background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-size:1.3rem;font-weight:700;color:var(--accent,#d4a03c);font-family:Orbitron,monospace;min-height:200px;box-sizing:border-box;';
  var back=document.createElement('div');
  back.style.cssText='position:absolute;inset:0;backface-visibility:hidden;background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-size:1rem;color:var(--text,#e4ddd0);transform:rotateY(180deg);min-height:200px;box-sizing:border-box;line-height:1.5;';
  card.appendChild(front);card.appendChild(back);
  cardWrap.appendChild(card);box.appendChild(cardWrap);
  var flipped=false;
  card.onclick=function(){flipped=!flipped;card.style.transform=flipped?'rotateY(180deg)':'rotateY(0)';};
  cardWrap.addEventListener('touchstart',function(e){touchStartX=e.touches[0].clientX;},{passive:true});
  cardWrap.addEventListener('touchend',function(e){
   var dx=e.changedTouches[0].clientX-touchStartX;
   if(Math.abs(dx)>50){if(dx>0)doKnow();else doReview();}
  });
  var btns=document.createElement('div');
  btns.style.cssText='display:flex;gap:1rem;justify-content:center;';
  var reviewBtn=document.createElement('button');
  reviewBtn.style.cssText='background:#c0392b;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  reviewBtn.textContent='\u2717 '+(L.flashReview||'Review later');
  var knowBtn=document.createElement('button');
  knowBtn.style.cssText='background:#27ae60;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  knowBtn.textContent='\u2713 '+(L.flashKnow||'Know it');
  btns.appendChild(reviewBtn);btns.appendChild(knowBtn);
  box.appendChild(btns);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
  function updateCard(){
   if(deck.length===0){
    front.textContent='\ud83c\udf89';
    back.textContent=L.flashDone||'All cards reviewed!';
    progFill.style.width='100%';
    progText.textContent=(L.flashProgress||'{0} of {1} remaining').replace('{0}','0').replace('{1}',String(total));
    try{localStorage.setItem(storageKey,JSON.stringify({known:known,total:total,date:new Date().toISOString()}));}catch(e){}
    reviewBtn.style.display='none';knowBtn.style.display='none';
    return;
   }
   flipped=false;card.style.transform='rotateY(0)';
   front.textContent=deck[0].term;
   back.textContent=deck[0].def;
   var pct=Math.round((1-deck.length/total)*100);
   progFill.style.width=pct+'%';
   progText.textContent=(L.flashProgress||'{0} of {1} remaining').replace('{0}',String(deck.length)).replace('{1}',String(total));
  }
  function doKnow(){if(deck.length>0){deck.shift();known++;updateCard();}}
  function doReview(){if(deck.length>0){var c=deck.shift();deck.push(c);updateCard();}}
  knowBtn.onclick=function(e){e.stopPropagation();doKnow();};
  reviewBtn.onclick=function(e){e.stopPropagation();doReview();};
  updateCard();
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:8rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initFlashcards();}catch(e){console.warn('Flashcards init:',e);}});

/* === PROGRESS CERTIFICATE === */
function initCertificate(){
 if(document.getElementById('certBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.certTitle)return;
 var pathParts=location.pathname.split('/').filter(Boolean);
 var catDir='';var appDir='';
 for(var p=0;p<pathParts.length-1;p++){
  if(/^\d{2}-/.test(pathParts[p])){catDir=pathParts[p];appDir=pathParts[p+1]||'';break;}
 }
 if(!catDir)return;
 var catKey='cert_cat_'+catDir;
 var visited={};
 try{visited=JSON.parse(localStorage.getItem(catKey)||'{}');}catch(e){}
 if(appDir){visited[appDir]=Date.now();try{localStorage.setItem(catKey,JSON.stringify(visited));}catch(e){}}
 var siblingApps=[];
 try{
  var scripts=document.querySelectorAll('script[src]');
  scripts.forEach(function(s){
   var src=s.getAttribute('src')||'';
   if(src.indexOf('catalog')>-1||src.indexOf('index')>-1){
    var m=src.match(/(\d{2}-[^/]+)/);
    if(m)catDir=m[1];
   }
  });
 }catch(e){}
 var catName=catDir.replace(/^\d{2}-/,'').replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
 var btn=document.createElement('button');
 btn.id='certBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83c\udfc6';
 btn.title=L.certTitle||'Certificate';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var visitedCount=Object.keys(visited).length;
  var totalApps=Math.max(visitedCount,3);
  var allDone=visitedCount>=totalApps&&visitedCount>1;
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:660px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:1rem;font-family:Orbitron,monospace;';
  h3.textContent=L.certTitle;
  box.appendChild(h3);
  var progWrap=document.createElement('div');
  progWrap.style.cssText='margin-bottom:1rem;';
  var progBar=document.createElement('div');
  progBar.style.cssText='background:rgba(255,255,255,0.1);border-radius:8px;height:10px;overflow:hidden;margin-bottom:0.5rem;';
  var progFill=document.createElement('div');
  var pct=totalApps>0?Math.min(100,Math.round(visitedCount/totalApps*100)):0;
  progFill.style.cssText='height:100%;background:var(--accent,#d4a03c);border-radius:8px;transition:width 0.5s;width:'+pct+'%;';
  progBar.appendChild(progFill);
  progWrap.appendChild(progBar);
  var progLabel=document.createElement('div');
  progLabel.style.cssText='font-size:0.9rem;opacity:0.8;';
  progLabel.textContent=(L.certProgress||'{0} of {1} apps completed').replace('{0}',String(visitedCount)).replace('{1}',String(totalApps));
  progWrap.appendChild(progLabel);
  box.appendChild(progWrap);
  if(allDone){
   var canvas=document.createElement('canvas');
   canvas.width=600;canvas.height=400;
   canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;margin:1rem 0;';
   box.appendChild(canvas);
   var ctx=canvas.getContext('2d');
   ctx.fillStyle='#0b0d24';ctx.fillRect(0,0,600,400);
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=6;
   ctx.strokeRect(10,10,580,380);
   ctx.strokeStyle='#b8941f';ctx.lineWidth=2;
   ctx.strokeRect(18,18,564,364);
   ctx.fillStyle='#d4a03c';ctx.font='bold 22px Orbitron,monospace';
   var certText=L.certTitle||'CERTIFICATE OF COMPLETION';
   ctx.fillText(certText,(600-ctx.measureText(certText).width)/2,70);
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(100,85);ctx.lineTo(500,85);ctx.stroke();
   ctx.fillStyle='#e4ddd0';ctx.font='16px Tajawal,sans-serif';
   var compText=L.certComplete||'Congratulations! All apps completed!';
   ctx.fillText(compText,(600-ctx.measureText(compText).width)/2,130);
   ctx.fillStyle='#d4a03c';ctx.font='bold 20px Orbitron,monospace';
   ctx.fillText(catName,(600-ctx.measureText(catName).width)/2,180);
   ctx.fillStyle='#e4ddd0';ctx.font='14px Tajawal,sans-serif';
   var dateStr=new Date().toLocaleDateString();
   ctx.fillText(dateStr,(600-ctx.measureText(dateStr).width)/2,220);
   var ranks=['Recruit','Field Agent','Special Agent','Senior Operative','Shadow Commander','Ghost Director'];
   var rank=ranks[Math.min(ranks.length-1,Math.floor(visitedCount/3))];
   ctx.fillStyle='#ffd700';ctx.font='bold 18px Orbitron,monospace';
   ctx.fillText(rank,(600-ctx.measureText(rank).width)/2,260);
   ctx.beginPath();ctx.arc(300,330,35,0,Math.PI*2);
   ctx.fillStyle='rgba(212,160,60,0.15)';ctx.fill();
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=3;ctx.stroke();
   ctx.beginPath();ctx.arc(300,330,28,0,Math.PI*2);
   ctx.strokeStyle='#b8941f';ctx.lineWidth=1.5;ctx.stroke();
   ctx.fillStyle='#d4a03c';ctx.font='bold 20px serif';
   ctx.fillText('\u2605',292,337);
   ctx.fillStyle='rgba(212,160,60,0.08)';ctx.font='10px monospace';
   var certName=L.certName||'Workshop DIY';
   ctx.fillStyle='#888';ctx.font='11px Tajawal,sans-serif';
   ctx.fillText(certName,(600-ctx.measureText(certName).width)/2,390);
   var dlBtn=document.createElement('button');
   dlBtn.textContent=L.certDownload||'Download Certificate';
   dlBtn.style.cssText='margin-top:1rem;background:var(--accent,#d4a03c);color:#000;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
   dlBtn.onclick=function(){
    var link=document.createElement('a');
    link.download='certificate-'+catDir+'.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
   };
   box.appendChild(dlBtn);
  }else{
   var lockMsg=document.createElement('div');
   lockMsg.style.cssText='font-size:2.5rem;margin:1rem 0;';
   lockMsg.textContent='\ud83d\udd12';
   box.appendChild(lockMsg);
   var hint=document.createElement('div');
   hint.style.cssText='opacity:0.6;font-size:0.9rem;';
   hint.textContent='Visit all apps in this category to unlock the certificate.';
   box.appendChild(hint);
  }
  var appList=document.createElement('div');
  appList.style.cssText='margin-top:1rem;text-align:left;max-height:150px;overflow-y:auto;padding:0.5rem;background:rgba(0,0,0,0.3);border-radius:8px;font-size:0.8rem;';
  Object.keys(visited).sort().forEach(function(a){
   var row=document.createElement('div');
   row.style.cssText='padding:2px 4px;opacity:0.7;';
   row.textContent='\u2713 '+a;
   appList.appendChild(row);
  });
  if(Object.keys(visited).length>0)box.appendChild(appList);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:9.5rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initCertificate();}catch(e){console.warn('Certificate init:',e);}});
"""


def find_script_files():
    """Find all script.js files in the catalog."""
    pattern = os.path.join(CATALOG, '*', '*', 'script.js')
    return sorted(glob.glob(pattern))


def inject_lang_keys(content, lang_en, lang_fr, lang_ar):
    """Inject LANG keys into the appropriate locations in script.js content."""

    # Detect format: old format uses ...LANG_BASE.en, new format uses },fr:{
    is_old_format = '...LANG_BASE.en,' in content
    is_new_format = '},fr:{' in content and not is_old_format

    if is_old_format:
        content = content.replace(
            '...LANG_BASE.en,',
            '...LANG_BASE.en,' + lang_en,
            1
        )
        content = content.replace(
            '...LANG_BASE.fr,',
            '...LANG_BASE.fr,' + lang_fr,
            1
        )
        content = content.replace(
            '...LANG_BASE.ar,',
            '...LANG_BASE.ar,' + lang_ar,
            1
        )
    elif is_new_format:
        content = content.replace(
            'const LANG={en:{',
            'const LANG={en:{' + lang_en,
            1
        )
        content = content.replace(
            '},fr:{',
            '},fr:{' + lang_fr,
            1
        )
        content = content.replace(
            '},ar:{',
            '},ar:{' + lang_ar,
            1
        )
    else:
        # Fallback: try to find LANG = { en: { pattern (multiline with spaces)
        m = re.search(r'(const\s+LANG\s*=\s*\{\s*en\s*:\s*\{)', content)
        if m:
            content = content[:m.end()] + lang_en + content[m.end():]
        m_fr = re.search(r'(,\s*fr\s*:\s*\{)', content)
        if m_fr:
            content = content[:m_fr.end()] + lang_fr + content[m_fr.end():]
        m_ar = re.search(r'(,\s*ar\s*:\s*\{)', content)
        if m_ar:
            content = content[:m_ar.end()] + lang_ar + content[m_ar.end():]

    return content


def find_lang_block_end(content):
    """Find the closing }; of the const LANG block."""
    lang_start = content.find('const LANG')
    if lang_start == -1:
        return -1

    brace_start = content.find('{', lang_start)
    if brace_start == -1:
        return -1

    depth = 0
    i = brace_start
    while i < len(content):
        ch = content[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                j = i + 1
                while j < len(content) and content[j] in ' \t\n\r':
                    j += 1
                if j < len(content) and content[j] == ';':
                    return j + 1
                return i + 1
        # Skip string literals
        if ch == "'" and (i == 0 or content[i-1] != '\\'):
            i += 1
            while i < len(content) and not (content[i] == "'" and content[i-1] != '\\'):
                i += 1
        elif ch == '`':
            i += 1
            while i < len(content) and content[i] != '`':
                i += 1
        i += 1

    return -1


def process_file(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if 'flashTitle' in content:
        return False

    # Step 1: Inject LANG keys
    content = inject_lang_keys(content, LANG_EN, LANG_FR, LANG_AR)

    # Step 2: Inject JS functions after the LANG block closing };
    lang_end = find_lang_block_end(content)
    if lang_end != -1:
        content = content[:lang_end] + '\n' + JS_FUNCTIONS + '\n' + content[lang_end:]
    else:
        content += '\n' + JS_FUNCTIONS

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


def main():
    files = find_script_files()
    print(f'Found {len(files)} script.js files')

    modified = 0
    skipped = 0
    errors = []

    for filepath in files:
        try:
            if process_file(filepath):
                modified += 1
            else:
                skipped += 1
        except Exception as e:
            errors.append((filepath, str(e)))
            print(f'  ERROR: {filepath}: {e}')

    print(f'\nResults: {modified} modified, {skipped} skipped (already done), {len(errors)} errors')

    # Verify 30 random files with node -c
    print('\nVerifying 30 random files with node -c ...')
    sample = random.sample(files, min(30, len(files)))
    ok = 0
    fail = 0
    for filepath in sample:
        result = subprocess.run(
            ['node', '-c', filepath],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            ok += 1
        else:
            fail += 1
            print(f'  FAIL: {filepath}')
            print(f'        {result.stderr.strip()[:200]}')

    print(f'Verification: {ok}/30 passed, {fail}/30 failed')

    if errors:
        print('\nErrors:')
        for fp, err in errors:
            print(f'  {fp}: {err}')


if __name__ == '__main__':
    main()
