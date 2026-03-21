#!/usr/bin/env python3
"""
add_sound_weather.py
Adds Sound Landscape + Weather System to all 488 apps in ops-catalog.
Idempotent: skips files already containing 'soundTitle'.
"""

import os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──

LANG_EN = (
    "soundTitle:'Sound Landscape',"
    "soundOn:'Sound ON',"
    "soundOff:'Sound OFF',"
    "soundVolume:'Volume',"
    "weatherTitle:'Weather System',"
    "weatherOn:'Weather ON',"
    "weatherOff:'Weather OFF',"
    "weatherInfo:'Visual weather overlay reacts to simulation state',"
)

LANG_FR = (
    "soundTitle:'Paysage Sonore',"
    "soundOn:'Son ACTIV\\x27',"
    "soundOff:'Son D\\x27SACTIV\\x27',"
    "soundVolume:'Volume',"
    "weatherTitle:'Syst\\x27me M\\x27t\\x27o',"
    "weatherOn:'M\\x27t\\x27o ACTIV\\x27E',"
    "weatherOff:'M\\x27t\\x27o D\\x27SACTIV\\x27E',"
    "weatherInfo:'Effets m\\x27t\\x27o visuels selon l\\x27\\x27tat de la simulation',"
)

LANG_AR = (
    "soundTitle:'\u0627\u0644\u0645\u0634\u0647\u062f \u0627\u0644\u0635\u0648\u062a\u064a',"
    "soundOn:'\u0627\u0644\u0635\u0648\u062a \u0645\u064f\u0641\u0639\u0651\u0644',"
    "soundOff:'\u0627\u0644\u0635\u0648\u062a \u0645\u064f\u0639\u0637\u0651\u0644',"
    "soundVolume:'\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0635\u0648\u062a',"
    "weatherTitle:'\u0646\u0638\u0627\u0645 \u0627\u0644\u0637\u0642\u0633',"
    "weatherOn:'\u0627\u0644\u0637\u0642\u0633 \u0645\u064f\u0641\u0639\u0651\u0644',"
    "weatherOff:'\u0627\u0644\u0637\u0642\u0633 \u0645\u064f\u0639\u0637\u0651\u0644',"
    "weatherInfo:'\u062a\u0623\u062b\u064a\u0631\u0627\u062a \u0637\u0642\u0633 \u0628\u0635\u0631\u064a\u0629 \u062a\u062a\u0641\u0627\u0639\u0644 \u0645\u0639 \u062d\u0627\u0644\u0629 \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629',"
)

# ── JS code to inject after the LANG block closing `};` ──

JS_CODE = r'''
/* ═══════ Sound Landscape ═══════ */
function initSoundLandscape(){
 var catMatch=window.location.pathname.match(/\/(\d+)-/);
 var catNum=catMatch?parseInt(catMatch[1],10):0;
 var profile='default';
 if(catNum>=1&&catNum<=7)profile='spy';
 else if(catNum>=8&&catNum<=16)profile='wifi';
 else if(catNum>=17&&catNum<=30)profile='rf';
 else if(catNum>=31&&catNum<=36)profile='crypto';
 else if(catNum>=37&&catNum<=45)profile='bio';
 else if(catNum>=46&&catNum<=50)profile='physics';
 else if(catNum>=51&&catNum<=55)profile='escape';
 var slAudioCtx=null,slGain=null,slMuted=false,slActive=false,slVolume=0.15;
 var slNodes=[];
 function slCreateNoise(ctx,dest){
  var bufSize=2*ctx.sampleRate,buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);
  var d=buf.getChannelData(0);for(var i=0;i<bufSize;i++)d[i]=Math.random()*2-1;
  var src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
  var filt=ctx.createBiquadFilter();filt.type='lowpass';filt.frequency.value=400;
  src.connect(filt);filt.connect(dest);src.start();
  slNodes.push(src);return{src:src,filt:filt};
 }
 function slCreateOsc(ctx,dest,freq,type,vol){
  var osc=ctx.createOscillator();osc.type=type||'sine';osc.frequency.value=freq;
  var g=ctx.createGain();g.gain.value=vol||0.03;
  osc.connect(g);g.connect(dest);osc.start();slNodes.push(osc);return osc;
 }
 function slBuildProfile(ctx,dest){
  switch(profile){
   case'spy':slCreateOsc(ctx,dest,55,'sine',0.04);setInterval(function(){if(!slActive||slMuted)return;var o=ctx.createOscillator();var g=ctx.createGain();o.connect(g);g.connect(dest);o.frequency.value=1200;o.type='sine';g.gain.value=0.02;var t=ctx.currentTime;g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);},3000+Math.random()*4000);break;
   case'wifi':slCreateNoise(ctx,dest);setInterval(function(){if(!slActive||slMuted)return;var o=ctx.createOscillator();var g=ctx.createGain();o.connect(g);g.connect(dest);o.frequency.value=800+Math.random()*1200;o.type='square';g.gain.value=0.015;var t=ctx.currentTime;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);},500+Math.random()*1500);break;
   case'rf':var n=slCreateNoise(ctx,dest);n.filt.frequency.value=2000;setInterval(function(){if(!slActive||slMuted)return;var o=ctx.createOscillator();var g=ctx.createGain();o.connect(g);g.connect(dest);o.type='sawtooth';g.gain.value=0.02;var t=ctx.currentTime;o.frequency.setValueAtTime(200,t);o.frequency.linearRampToValueAtTime(3000,t+0.5);g.gain.exponentialRampToValueAtTime(0.001,t+0.5);o.start(t);o.stop(t+0.5);},2000+Math.random()*3000);break;
   case'crypto':setInterval(function(){if(!slActive||slMuted)return;var count=1+Math.floor(Math.random()*4);for(var i=0;i<count;i++){(function(idx){setTimeout(function(){var o=ctx.createOscillator();var g=ctx.createGain();o.connect(g);g.connect(dest);o.frequency.value=3000+Math.random()*2000;o.type='sine';g.gain.value=0.01;var t=ctx.currentTime;g.gain.exponentialRampToValueAtTime(0.001,t+0.03);o.start(t);o.stop(t+0.03);},idx*80);})(i);}},800+Math.random()*1200);break;
   case'bio':slCreateOsc(ctx,dest,1.2,'sine',0.0);var bioOsc=slCreateOsc(ctx,dest,60,'sine',0.03);setInterval(function(){if(!slActive||slMuted)return;var t=ctx.currentTime;bioOsc.frequency.setValueAtTime(80,t);bioOsc.frequency.exponentialRampToValueAtTime(60,t+0.15);},850);var softO=slCreateOsc(ctx,dest,440,'sine',0.008);break;
   case'physics':var n2=slCreateNoise(ctx,dest);n2.filt.frequency.value=800;n2.filt.type='bandpass';slCreateOsc(ctx,dest,120,'sine',0.02);break;
   case'escape':slCreateOsc(ctx,dest,40,'sawtooth',0.03);setInterval(function(){if(!slActive||slMuted)return;var o=ctx.createOscillator();var g=ctx.createGain();o.connect(g);g.connect(dest);o.frequency.value=600;o.type='square';g.gain.value=0.02;var t=ctx.currentTime;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);},2500+Math.random()*2500);break;
   default:slCreateOsc(ctx,dest,80,'sine',0.02);slCreateNoise(ctx,dest);break;
  }
 }
 function slSampleCanvas(){
  var c=document.getElementById('simCanvas');if(!c||!slGain||!slActive)return;
  try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,Math.min(c.width,100),Math.min(c.height,50)).data;
  var sum=0;for(var i=0;i<d.length;i+=16)sum+=d[i]+d[i+1]+d[i+2];
  var avg=sum/(d.length/16*3)/255;
  slGain.gain.setTargetAtTime(slMuted?0:slVolume*(0.3+avg*0.7),slAudioCtx.currentTime,0.3);
  }catch(e){}
 }
 function slStart(){
  if(slActive)return;slActive=true;
  if(!slAudioCtx)slAudioCtx=new(window.AudioContext||window.webkitAudioContext)();
  slGain=slAudioCtx.createGain();slGain.gain.value=slMuted?0:slVolume;
  slGain.connect(slAudioCtx.destination);
  slBuildProfile(slAudioCtx,slGain);
  setInterval(slSampleCanvas,500);
 }
 function slStop(){
  slActive=false;slNodes.forEach(function(n){try{n.stop();}catch(e){}});slNodes=[];
  if(slGain)slGain.disconnect();slGain=null;
 }
 var hb=document.querySelector('.header-buttons');if(!hb)return;
 var btn=document.createElement('button');btn.className='btn-icon-only';btn.id='soundLandscapeBtn';
 btn.textContent='\uD83D\uDD0A';btn.title=(typeof LANG!=='undefined'&&LANG[document.documentElement.lang||'en'])?LANG[document.documentElement.lang||'en'].soundTitle||'Sound Landscape':'Sound Landscape';
 hb.insertBefore(btn,hb.firstChild);
 var panel=document.createElement('div');panel.id='soundLandscapePanel';
 panel.style.cssText='display:none;position:fixed;top:60px;right:20px;background:var(--card-bg,#1a1a2e);color:var(--text,#e0e0e0);border:1px solid var(--accent,#0ff);border-radius:12px;padding:16px;z-index:9999;min-width:200px;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
 var L=(typeof LANG!=='undefined')?LANG[document.documentElement.lang||'en']||{}:{};
 panel.innerHTML='<div style="font-weight:bold;margin-bottom:8px;">'+(L.soundTitle||'Sound Landscape')+'</div>'+
  '<label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><input type="checkbox" id="slToggle"> <span id="slLabel">'+(L.soundOff||'Sound OFF')+'</span></label>'+
  '<label style="display:flex;align-items:center;gap:8px;"><span>'+(L.soundVolume||'Volume')+'</span><input type="range" id="slVolSlider" min="0" max="100" value="15" style="flex:1;"></label>';
 document.body.appendChild(panel);
 btn.addEventListener('click',function(){panel.style.display=panel.style.display==='none'?'block':'none';});
 document.getElementById('slToggle').addEventListener('change',function(){
  if(this.checked){slStart();document.getElementById('slLabel').textContent=L.soundOn||'Sound ON';}
  else{slStop();document.getElementById('slLabel').textContent=L.soundOff||'Sound OFF';}
 });
 document.getElementById('slVolSlider').addEventListener('input',function(){
  slVolume=this.value/100;if(slGain&&!slMuted)slGain.gain.setTargetAtTime(slVolume,slAudioCtx.currentTime,0.1);
 });
}

/* ═══════ Weather System ═══════ */
function initWeatherSystem(){
 var simCanvas=document.getElementById('simCanvas');if(!simCanvas)return;
 var wsKey='weatherSystem_enabled';
 var wsActive=localStorage.getItem(wsKey)==='true';
 var wsCanvas=document.createElement('canvas');
 wsCanvas.id='weatherCanvas';wsCanvas.width=simCanvas.width;wsCanvas.height=simCanvas.height;
 wsCanvas.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
 var parent=simCanvas.parentElement;
 if(parent)parent.style.position=parent.style.position||'relative';
 if(parent)parent.insertBefore(wsCanvas,simCanvas.nextSibling);
 var wCtx=wsCanvas.getContext('2d');
 var particles=[];var lastBrightness=0;var prevBrightness=0;var flashAlpha=0;var snowMode=false;
 var idleFrames=0;var lastCanvasSum=0;
 function wsSampleBrightness(){
  try{var c=simCanvas.getContext('2d');var d=c.getImageData(0,0,Math.min(simCanvas.width,80),Math.min(simCanvas.height,40)).data;
  var sum=0;for(var i=0;i<d.length;i+=20)sum+=d[i]+d[i+1]+d[i+2];
  var avg=sum/(d.length/20*3)/255;
  var diff=Math.abs(sum-lastCanvasSum);
  if(diff<10)idleFrames++;else idleFrames=0;
  lastCanvasSum=sum;prevBrightness=lastBrightness;lastBrightness=avg;
  snowMode=idleFrames>120;
  if(Math.abs(avg-prevBrightness)>0.15)flashAlpha=0.8;
  return avg;}catch(e){return 0.5;}
 }
 function wsSpawnRain(count){
  for(var i=0;i<count;i++)particles.push({type:'rain',x:Math.random()*wsCanvas.width,y:Math.random()*-wsCanvas.height,vy:4+Math.random()*6,vx:-1-Math.random(),len:10+Math.random()*15,life:1});
 }
 function wsSpawnSnow(count){
  for(var i=0;i<count;i++)particles.push({type:'snow',x:Math.random()*wsCanvas.width,y:Math.random()*-50,vy:0.5+Math.random()*1.5,vx:Math.sin(Date.now()/1000+i)*0.5,r:1+Math.random()*3,life:1});
 }
 var animId=null;
 function wsRender(){
  if(!wsActive){wCtx.clearRect(0,0,wsCanvas.width,wsCanvas.height);return;}
  animId=requestAnimationFrame(wsRender);
  wCtx.clearRect(0,0,wsCanvas.width,wsCanvas.height);
  var bright=wsSampleBrightness();
  if(snowMode){wsSpawnSnow(1);}
  else if(bright<0.3){wsSpawnRain(2);}
  if(bright>0.6&&!snowMode){
   var grd=wCtx.createRadialGradient(wsCanvas.width/2,0,0,wsCanvas.width/2,0,wsCanvas.width*0.6);
   grd.addColorStop(0,'rgba(255,255,100,'+(0.03+bright*0.04)+')');grd.addColorStop(1,'rgba(255,255,100,0)');
   wCtx.fillStyle=grd;wCtx.fillRect(0,0,wsCanvas.width,wsCanvas.height);
  }
  if(flashAlpha>0.01){
   wCtx.fillStyle='rgba(255,255,255,'+flashAlpha+')';wCtx.fillRect(0,0,wsCanvas.width,wsCanvas.height);
   flashAlpha*=0.85;
  }
  for(var i=particles.length-1;i>=0;i--){
   var p=particles[i];
   if(p.type==='rain'){
    p.x+=p.vx;p.y+=p.vy;
    wCtx.strokeStyle='rgba(120,160,255,0.5)';wCtx.lineWidth=1;
    wCtx.beginPath();wCtx.moveTo(p.x,p.y);wCtx.lineTo(p.x+p.vx*2,p.y+p.len);wCtx.stroke();
    if(p.y>wsCanvas.height)particles.splice(i,1);
   }else if(p.type==='snow'){
    p.x+=Math.sin(Date.now()/1000+i)*0.3+p.vx;p.y+=p.vy;
    wCtx.fillStyle='rgba(255,255,255,0.7)';wCtx.beginPath();
    wCtx.arc(p.x,p.y,p.r,0,Math.PI*2);wCtx.fill();
    if(p.y>wsCanvas.height)particles.splice(i,1);
   }
  }
  if(particles.length>500)particles.splice(0,particles.length-500);
 }
 function wsStart(){wsActive=true;localStorage.setItem(wsKey,'true');wsRender();}
 function wsStopFn(){wsActive=false;localStorage.setItem(wsKey,'false');if(animId)cancelAnimationFrame(animId);wCtx.clearRect(0,0,wsCanvas.width,wsCanvas.height);particles=[];}
 var hb=document.querySelector('.header-buttons');if(!hb)return;
 var btn=document.createElement('button');btn.className='btn-icon-only';btn.id='weatherBtn';
 btn.textContent='\u2601\uFE0F';
 var L=(typeof LANG!=='undefined')?LANG[document.documentElement.lang||'en']||{}:{};
 btn.title=L.weatherTitle||'Weather System';
 hb.insertBefore(btn,hb.firstChild);
 var panel=document.createElement('div');panel.id='weatherPanel';
 panel.style.cssText='display:none;position:fixed;top:60px;right:20px;background:var(--card-bg,#1a1a2e);color:var(--text,#e0e0e0);border:1px solid var(--accent,#0ff);border-radius:12px;padding:16px;z-index:9999;min-width:200px;box-shadow:0 4px 20px rgba(0,0,0,0.5);';
 panel.innerHTML='<div style="font-weight:bold;margin-bottom:8px;">'+(L.weatherTitle||'Weather System')+'</div>'+
  '<label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><input type="checkbox" id="wsToggle"'+(wsActive?' checked':'')+
  '> <span id="wsLabel">'+(wsActive?(L.weatherOn||'Weather ON'):(L.weatherOff||'Weather OFF'))+'</span></label>'+
  '<div style="font-size:0.85em;opacity:0.7;">'+(L.weatherInfo||'Visual weather overlay reacts to simulation state')+'</div>';
 document.body.appendChild(panel);
 btn.addEventListener('click',function(){panel.style.display=panel.style.display==='none'?'block':'none';});
 document.getElementById('wsToggle').addEventListener('change',function(){
  if(this.checked){wsStart();document.getElementById('wsLabel').textContent=L.weatherOn||'Weather ON';}
  else{wsStopFn();document.getElementById('wsLabel').textContent=L.weatherOff||'Weather OFF';}
 });
 if(wsActive)wsStart();
}

document.addEventListener('DOMContentLoaded',function(){try{initSoundLandscape();}catch(e){console.warn('SoundLandscape init:',e);}try{initWeatherSystem();}catch(e){console.warn('WeatherSystem init:',e);}});
'''

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if 'soundTitle' in content:
        return 'skipped'

    modified = False

    # ── Inject LANG keys after ...LANG_BASE.en, / .fr, / .ar, ──
    for tag, keys in [('en', LANG_EN), ('fr', LANG_FR), ('ar', LANG_AR)]:
        marker = f'...LANG_BASE.{tag},'
        idx = content.find(marker)
        if idx != -1:
            insert_pos = idx + len(marker)
            content = content[:insert_pos] + keys + content[insert_pos:]
            modified = True

    # ── Find the LANG block closing `};` and inject JS after it ──
    # The LANG block starts with `const LANG = {` and the closing `};`
    # is the first `};` on its own line after `const LANG = {`.
    lang_start = content.find('const LANG = {')
    if lang_start != -1:
        # Find `};` after the LANG block - search for `\n};` pattern
        search_from = lang_start
        # Find the closing `};` - it appears as `\n};` after the ar block
        close_idx = content.find('\n};', search_from)
        if close_idx != -1:
            insert_pos = close_idx + 3  # after `\n};`
            content = content[:insert_pos] + '\n' + JS_CODE + content[insert_pos:]
            modified = True

    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return 'modified'
    return 'unchanged'


def main():
    # Find all script.js files in category/app dirs
    pattern = os.path.join(BASE, '[0-9][0-9]-*', '*', 'script.js')
    files = sorted(glob.glob(pattern))
    print(f'Found {len(files)} script.js files')

    stats = {'modified': 0, 'skipped': 0, 'unchanged': 0, 'error': 0}
    errors = []

    for fpath in files:
        try:
            result = process_file(fpath)
            stats[result] += 1
        except Exception as e:
            stats['error'] += 1
            errors.append(f'{fpath}: {e}')

    print(f'\nResults:')
    print(f'  Modified:  {stats["modified"]}')
    print(f'  Skipped:   {stats["skipped"]} (already had soundTitle)')
    print(f'  Unchanged: {stats["unchanged"]}')
    print(f'  Errors:    {stats["error"]}')

    if errors:
        print('\nErrors:')
        for e in errors[:20]:
            print(f'  {e}')

    print(f'\nTotal processed: {sum(stats.values())}')

    # ── Verify 30 random files with node -c ──
    import subprocess, random
    random.seed(42)
    sample = random.sample(files, min(30, len(files)))
    print(f'\n── Verifying {len(sample)} random files with node -c ──')
    ok = 0
    fail = 0
    for fpath in sample:
        r = subprocess.run(['node', '-c', fpath], capture_output=True, text=True)
        if r.returncode == 0:
            ok += 1
        else:
            fail += 1
            short = fpath.replace(BASE + '/', '')
            print(f'  FAIL: {short}')
            print(f'    {r.stderr.strip()[:200]}')
    print(f'  {ok} PASS, {fail} FAIL out of {len(sample)}')


if __name__ == '__main__':
    main()
