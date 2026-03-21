#!/usr/bin/env python3
"""
Add Peer Mode + Activity Heatmap to all 488 Workshop DIY apps.
Handles both old (compact) and new (expanded) LANG template formats.
"""

import os, re, subprocess, random, json

BASE = os.path.dirname(os.path.abspath(__file__))

# ─── LANG keys to inject ───────────────────────────────────────────

EN_KEYS = (
    "peerTitle:'\xf0\x9f\x91\xa5 Peer Mode',"
    "peerConnect:'Connect',"
    "peerDisconnect:'Disconnect',"
    "peerStatus:'Peer Status',"
    "peerSend:'Sent',"
    "peerReceive:'Received',"
    "peerInfo:'Open this app in two tabs to sync parameters via BroadcastChannel',"
    "heatmapTitle:'\xf0\x9f\x93\x85 Activity Heatmap',"
    "heatmapToday:'Today',"
    "heatmapStreak:'Streak',"
    "heatmapTotal:'Total',"
    "heatmapLegend:'Less \\u2192 More',"
)

FR_KEYS = (
    "peerTitle:'\xf0\x9f\x91\xa5 Mode Pair',"
    "peerConnect:'Connecter',"
    "peerDisconnect:'D\\xe9connecter',"
    "peerStatus:'Statut pair',"
    "peerSend:'Envoy\\xe9',"
    "peerReceive:'Re\\xe7u',"
    "peerInfo:'Ouvrez cette app dans deux onglets pour synchroniser les param\\xe8tres',"
    "heatmapTitle:'\xf0\x9f\x93\x85 Carte d\\x27activit\\xe9',"
    "heatmapToday:'Aujourd\\x27hui',"
    "heatmapStreak:'S\\xe9rie',"
    "heatmapTotal:'Total',"
    "heatmapLegend:'Moins \\u2192 Plus',"
)

AR_KEYS = (
    "peerTitle:'\xf0\x9f\x91\xa5 \\u0648\\u0636\\u0639 \\u0627\\u0644\\u0646\\u0638\\u064a\\u0631',"
    "peerConnect:'\\u0627\\u062a\\u0635\\u0627\\u0644',"
    "peerDisconnect:'\\u0642\\u0637\\u0639',"
    "peerStatus:'\\u062d\\u0627\\u0644\\u0629 \\u0627\\u0644\\u0646\\u0638\\u064a\\u0631',"
    "peerSend:'\\u0623\\u0631\\u0633\\u0644',"
    "peerReceive:'\\u0627\\u0633\\u062a\\u0644\\u0645',"
    "peerInfo:'\\u0627\\u0641\\u062a\\u062d \\u0647\\u0630\\u0627 \\u0627\\u0644\\u062a\\u0637\\u0628\\u064a\\u0642 \\u0641\\u064a \\u062a\\u0628\\u0648\\u064a\\u0628\\u064a\\u0646 \\u0644\\u0644\\u0645\\u0632\\u0627\\u0645\\u0646\\u0629',"
    "heatmapTitle:'\xf0\x9f\x93\x85 \\u062e\\u0631\\u064a\\u0637\\u0629 \\u0627\\u0644\\u0646\\u0634\\u0627\\u0637',"
    "heatmapToday:'\\u0627\\u0644\\u064a\\u0648\\u0645',"
    "heatmapStreak:'\\u0633\\u0644\\u0633\\u0644\\u0629',"
    "heatmapTotal:'\\u0627\\u0644\\u0645\\u062c\\u0645\\u0648\\u0639',"
    "heatmapLegend:'\\u0623\\u0642\\u0644 \\u2192 \\u0623\\u0643\\u062b\\u0631',"
)

# ─── JS functions ───────────────────────────────────────────────────

JS_PEER_MODE = r"""
/* ═══════ PEER MODE (BroadcastChannel) ═══════ */
function initPeerMode(){var L=LANG[document.documentElement.lang||'en'];if(!L.peerTitle)return;if(typeof BroadcastChannel==='undefined'){console.warn('BroadcastChannel not available');return;}var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var channelName='peer_'+appDir;var bc=new BroadcastChannel(channelName);var peerActive=false;var msgCount=0;var container=document.getElementById('peerModePanel');if(!container){container=document.createElement('div');container.id='peerModePanel';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var anchor=document.getElementById('dailyChallenge');if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(container,anchor);}else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}container.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;"><span style="font-size:0.95rem;font-weight:700;" data-i18n="peerTitle">'+L.peerTitle+'</span>'+'<button id="peerToggleBtn" class="btn-sm" style="padding:0.3rem 0.8rem;border-radius:16px;cursor:pointer;" data-i18n="peerConnect">'+L.peerConnect+'</button>'+'<span id="peerStatusDot" style="font-size:0.85rem;">\ud83d\udd34 Solo</span>'+'<span id="peerMsgCount" style="font-size:0.75rem;opacity:0.6;margin-left:auto;">0 synced</span></div>'+'<p style="font-size:0.7rem;opacity:0.5;margin:0.3rem 0 0;" data-i18n="peerInfo">'+L.peerInfo+'</p>';var btn=document.getElementById('peerToggleBtn');var dot=document.getElementById('peerStatusDot');var counter=document.getElementById('peerMsgCount');btn.onclick=function(){peerActive=!peerActive;if(peerActive){btn.textContent=L.peerDisconnect||'Disconnect';dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');bc.postMessage({type:'ping'});}else{btn.textContent=L.peerConnect||'Connect';dot.textContent='\ud83d\udd34 Solo';}};bc.onmessage=function(e){if(!peerActive)return;var d=e.data;if(d&&d.type==='param'){var el=document.querySelector('[name="'+d.name+'"],#'+d.name);if(el&&el.type==='range'){el.value=d.value;el.dispatchEvent(new Event('input',{bubbles:true}));}msgCount++;counter.textContent=msgCount+' synced';}if(d&&d.type==='ping'){dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');}};document.querySelectorAll('input[type="range"]').forEach(function(slider){slider.addEventListener('input',function(){if(!peerActive)return;var nm=slider.name||slider.id||'';if(!nm)return;bc.postMessage({type:'param',name:nm,value:slider.value});msgCount++;counter.textContent=msgCount+' synced';});});}
"""

JS_HEATMAP = r"""
/* ═══════ ACTIVITY HEATMAP ═══════ */
function initActivityHeatmap(){var L=LANG[document.documentElement.lang||'en'];if(!L.heatmapTitle)return;var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey='activity_'+appDir;var data;try{data=JSON.parse(localStorage.getItem(storageKey)||'{}');}catch(e){data={};}if(!data.dates)data.dates={};var today=new Date().toISOString().slice(0,10);data.dates[today]=(data.dates[today]||0)+1;try{localStorage.setItem(storageKey,JSON.stringify(data));}catch(e){}var container=document.getElementById('activityHeatmap');if(!container){container=document.createElement('div');container.id='activityHeatmap';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var peer=document.getElementById('peerModePanel');if(peer&&peer.parentNode){peer.parentNode.insertBefore(container,peer.nextSibling);}else{var dc=document.getElementById('dailyChallenge');if(dc&&dc.parentNode)dc.parentNode.insertBefore(container,dc);else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}}var colors=['#161b22','#0e4429','#006d32','#26a641','#39d353'];function getColor(n){if(n===0)return colors[0];if(n===1)return colors[1];if(n<=3)return colors[2];if(n<=5)return colors[3];return colors[4];}var canvas=document.createElement('canvas');canvas.width=280;canvas.height=100;canvas.style.cssText='width:280px;max-width:100%;height:100px;border-radius:6px;cursor:pointer;display:block;margin:0.4rem 0;';var ctx=canvas.getContext('2d');var cellSize=10;var gap=2;var todayDate=new Date();todayDate.setHours(0,0,0,0);var startDate=new Date(todayDate);startDate.setDate(startDate.getDate()-(52*7-1));var tooltip=document.createElement('div');tooltip.style.cssText='display:none;position:absolute;z-index:9999;background:#1a1a2e;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;pointer-events:none;white-space:nowrap;';container.style.position='relative';container.appendChild(tooltip);var cellMap=[];function drawGrid(){ctx.clearRect(0,0,280,100);var d=new Date(startDate);for(var week=0;week<52;week++){for(var day=0;day<7;day++){var ds=d.toISOString().slice(0,10);var count=data.dates[ds]||0;var x=week*(cellSize+gap);var y=day*(cellSize+gap);ctx.fillStyle=getColor(count);ctx.fillRect(x,y,cellSize,cellSize);if(ds===today){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.strokeRect(x+0.5,y+0.5,cellSize-1,cellSize-1);}cellMap.push({x:x,y:y,date:ds,count:count});d.setDate(d.getDate()+1);}}}drawGrid();canvas.addEventListener('click',function(e){var rect=canvas.getBoundingClientRect();var scaleX=280/rect.width;var mx=(e.clientX-rect.left)*scaleX;var my=(e.clientY-rect.top)*(100/rect.height);for(var i=0;i<cellMap.length;i++){var c=cellMap[i];if(mx>=c.x&&mx<=c.x+cellSize&&my>=c.y&&my<=c.y+cellSize){tooltip.textContent=c.date+': '+c.count+' visits';tooltip.style.display='block';tooltip.style.left=(e.clientX-container.getBoundingClientRect().left+10)+'px';tooltip.style.top=(e.clientY-container.getBoundingClientRect().top-20)+'px';setTimeout(function(){tooltip.style.display='none';},2500);return;}}});var streak=0;var checkDate=new Date(todayDate);while(true){var ds=checkDate.toISOString().slice(0,10);if(data.dates[ds]&&data.dates[ds]>0){streak++;}else{break;}checkDate.setDate(checkDate.getDate()-1);}var totalSessions=0;Object.values(data.dates).forEach(function(v){totalSessions+=v;});var stats=document.createElement('div');stats.style.cssText='font-size:0.75rem;opacity:0.7;display:flex;gap:1rem;flex-wrap:wrap;';stats.innerHTML='<span data-i18n="heatmapToday">'+(L.heatmapToday||'Today')+'</span>: '+(data.dates[today]||0)+' | '+'<span data-i18n="heatmapStreak">'+(L.heatmapStreak||'Streak')+'</span>: '+streak+' days | '+'<span data-i18n="heatmapTotal">'+(L.heatmapTotal||'Total')+'</span>: '+totalSessions;var legend=document.createElement('div');legend.style.cssText='font-size:0.65rem;opacity:0.5;margin-top:0.2rem;';legend.innerHTML='<span data-i18n="heatmapLegend">'+(L.heatmapLegend||'Less \u2192 More')+'</span> ';colors.forEach(function(c){legend.innerHTML+='<span style="display:inline-block;width:10px;height:10px;background:'+c+';border-radius:2px;margin:0 1px;vertical-align:middle;"></span>';});container.innerHTML='<div style="font-size:0.95rem;font-weight:700;" data-i18n="heatmapTitle">'+L.heatmapTitle+'</div>';container.appendChild(canvas);container.appendChild(stats);container.appendChild(legend);container.style.position='relative';container.appendChild(tooltip);}
"""

JS_INIT = """
document.addEventListener('DOMContentLoaded',function(){try{initPeerMode();}catch(e){console.warn('Peer init:',e);}try{initActivityHeatmap();}catch(e){console.warn('Heatmap init:',e);}});
"""

# ─── HTML to inject ────────────────────────────────────────────────

HTML_INJECT = (
    '<div id="peerModePanel"></div>'
    '<div id="activityHeatmap"></div>'
)

# ─── Processing ────────────────────────────────────────────────────

def find_app_dirs():
    """Find all app directories containing script.js and index.html."""
    apps = []
    for cat in sorted(os.listdir(BASE)):
        cat_path = os.path.join(BASE, cat)
        if not os.path.isdir(cat_path) or cat == 'ops-catalog':
            continue
        for app in sorted(os.listdir(cat_path)):
            app_path = os.path.join(cat_path, app)
            sjs = os.path.join(app_path, 'script.js')
            ihtml = os.path.join(app_path, 'index.html')
            if os.path.isfile(sjs) and os.path.isfile(ihtml):
                apps.append(app_path)
    return apps


def inject_lang_keys(content):
    """Inject LANG keys into en/fr/ar blocks.

    Strategy: Find the transition markers between language blocks.
    - EN block ends where FR block starts: },fr:{ or }, fr: { or  fr: {
    - FR block ends where AR block starts: },ar:{ or }, ar: { or  ar: {
    - AR block ends at }}; (closing LANG)

    We inject keys just before each transition.
    """

    # Pattern 1: compact format  },fr:{  on same line
    # Pattern 2: expanded format   fr: {  on its own line

    # Inject EN keys before the fr block starts
    # Look for the pattern that starts the fr section within LANG

    # First, try compact: shareExport:'Export JSON',},fr:{
    # The EN keys go before },fr:{
    compact_fr = re.search(r"(,)\s*\},\s*fr\s*:\s*\{", content)
    expanded_fr = re.search(r"\n\s+fr\s*:\s*\{", content)

    if compact_fr:
        # Compact format: inject EN keys before },fr:{
        pos = compact_fr.start() + 1  # after the last comma
        content = content[:pos] + EN_KEYS + content[pos:]

        # Now find fr->ar transition (re-search since positions shifted)
        compact_ar = re.search(r"(,)\s*\},\s*ar\s*:\s*\{", content)
        if compact_ar:
            pos = compact_ar.start() + 1
            content = content[:pos] + FR_KEYS + content[pos:]

        # Now find ar block closing: the }};  at end of LANG
        # Find the last  }}; that closes the LANG object
        # AR keys go before the last ,}} or similar
        # Look for shareExport:'...',}} pattern in ar block
        ar_close = re.search(r"(,)\s*\}\s*\}\s*;", content)
        if ar_close:
            pos = ar_close.start() + 1
            content = content[:pos] + AR_KEYS + content[pos:]

    elif expanded_fr:
        # Expanded format: fr: { is on its own line
        # EN keys go on the line before fr: {
        # Find the line before fr: { — it should be something like   },
        # We need to insert after the last key in EN block

        # Find the en block's content end — the line right before the fr block
        # Look backwards from fr: { to find the last key line in en
        fr_match = expanded_fr

        # Find the ...LANG_BASE.en in the en block to locate it
        en_spread = content.rfind('...LANG_BASE.en', 0, fr_match.start())
        if en_spread == -1:
            # Try another pattern
            en_spread = content.rfind('en: {', 0, fr_match.start())

        # Find the closing of en block: the }, before fr: {
        en_close = content.rfind('},', 0, fr_match.start())
        if en_close == -1:
            en_close = content.rfind('}', 0, fr_match.start())

        # Insert EN keys before the }, that closes en block
        # Find the last comma before the } that closes en
        last_comma_before_en_close = content.rfind(',', 0, en_close)
        if last_comma_before_en_close > 0:
            pos = last_comma_before_en_close + 1
            content = content[:pos] + EN_KEYS + content[pos:]

        # Re-find fr->ar transition
        expanded_ar = re.search(r"\n\s+ar\s*:\s*\{", content)
        if expanded_ar:
            ar_start = expanded_ar.start()
            fr_close = content.rfind('},', 0, ar_start)
            if fr_close == -1:
                fr_close = content.rfind('}', 0, ar_start)
            last_comma_before_fr_close = content.rfind(',', 0, fr_close)
            if last_comma_before_fr_close > 0:
                pos = last_comma_before_fr_close + 1
                content = content[:pos] + FR_KEYS + content[pos:]

        # AR block closing
        # Find the }};  that closes LANG
        lang_close = re.search(r"\}\s*\}\s*;", content)
        if lang_close:
            ar_end = content.rfind(',', 0, lang_close.start())
            if ar_end > 0:
                pos = ar_end + 1
                content = content[:pos] + AR_KEYS + content[pos:]

    return content


def inject_lang_keys_v2(content):
    """Simpler approach: use the known markers to inject.

    All files have ...LANG_BASE.en/fr/ar spread markers.
    We find each spread marker and inject our keys right after the spread line.
    Actually, better: inject keys just BEFORE the transition to next lang block.

    Simplest reliable approach:
    - Find },fr:{ or  fr: {  => inject EN keys before it
    - Find },ar:{ or  ar: {  => inject FR keys before it
    - Find the final }}; closing LANG => inject AR keys before it
    """

    # Strategy: find transition points and work backwards from end to start
    # to avoid position invalidation

    # Step 1: Find all three injection points

    # Find the LANG = { or LANG={ declaration
    lang_decl = re.search(r'const\s+LANG\s*=\s*\{', content)
    if not lang_decl:
        return content
    lang_start = lang_decl.start()

    # Find the closing }}; of LANG
    # Need to find the matching close - look for }};  after lang_start
    # But there could be nested objects. Let's find the }};  pattern
    # that appears after the ar block

    # Find fr block start
    fr_patterns = [
        re.search(r'\},\s*fr\s*:\s*\{', content[lang_start:]),
        re.search(r'\n\s+fr\s*:\s*\{', content[lang_start:]),
    ]
    fr_match = None
    for p in fr_patterns:
        if p:
            if fr_match is None or p.start() < fr_match.start():
                fr_match = p

    if not fr_match:
        return content
    fr_abs = lang_start + fr_match.start()

    # Find ar block start (after fr)
    ar_search_start = fr_abs + 10
    ar_patterns = [
        re.search(r'\},\s*ar\s*:\s*\{', content[ar_search_start:]),
        re.search(r'\n\s+ar\s*:\s*\{', content[ar_search_start:]),
    ]
    ar_match = None
    for p in ar_patterns:
        if p:
            if ar_match is None or p.start() < ar_match.start():
                ar_match = p

    if not ar_match:
        return content
    ar_abs = ar_search_start + ar_match.start()

    # Find LANG closing }};  after ar block
    lang_close = re.search(r'\}\s*\}\s*;', content[ar_abs:])
    if not lang_close:
        return content
    lang_close_abs = ar_abs + lang_close.start()

    # Now inject in reverse order (ar, fr, en) to preserve positions

    # AR: inject before the final }};
    # Find the last comma in ar block before }};
    ar_last_comma = content.rfind(',', ar_abs, lang_close_abs)
    if ar_last_comma > 0:
        content = content[:ar_last_comma+1] + AR_KEYS + content[ar_last_comma+1:]

    # Recalculate ar_abs position shift
    shift = len(AR_KEYS)

    # FR: inject before ar block start
    # ar_abs shifted by AR_KEYS length
    ar_abs_new = ar_abs + shift
    # Find last comma in fr block before ar block
    fr_last_comma = content.rfind(',', fr_abs, ar_abs_new)
    if fr_last_comma > 0:
        content = content[:fr_last_comma+1] + FR_KEYS + content[fr_last_comma+1:]

    shift2 = len(FR_KEYS)

    # EN: inject before fr block start
    fr_abs_new = fr_abs + shift + shift2
    # Find last comma in en block before fr block
    en_last_comma = content.rfind(',', lang_start, fr_abs_new)
    if en_last_comma > 0:
        content = content[:en_last_comma+1] + EN_KEYS + content[en_last_comma+1:]

    return content


def process_script(script_path):
    """Process a single script.js file."""
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has peer mode
    if 'peerTitle' in content:
        return False

    # Inject LANG keys
    content = inject_lang_keys_v2(content)

    # Append JS functions at end of file
    content = content.rstrip() + '\n' + JS_PEER_MODE + JS_HEATMAP + JS_INIT

    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


def process_html(html_path):
    """Process a single index.html file."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has heatmap
    if 'activityHeatmap' in content:
        return False

    # Insert HTML before <script src="script.js">
    marker = '<script src="script.js">'
    if marker in content:
        content = content.replace(marker, HTML_INJECT + '\n' + marker, 1)
    else:
        # Fallback: insert before </body>
        content = content.replace('</body>', HTML_INJECT + '\n</body>', 1)

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


def main():
    apps = find_app_dirs()
    print(f'Found {len(apps)} apps')

    processed = 0
    skipped = 0
    errors = []

    for app_path in apps:
        app_name = os.path.basename(app_path)
        script_path = os.path.join(app_path, 'script.js')
        html_path = os.path.join(app_path, 'index.html')

        try:
            js_modified = process_script(script_path)
            html_modified = process_html(html_path)

            if js_modified or html_modified:
                processed += 1
            else:
                skipped += 1
        except Exception as e:
            errors.append((app_name, str(e)))
            print(f'  ERROR {app_name}: {e}')

    print(f'\nProcessed: {processed}')
    print(f'Skipped (already done): {skipped}')
    print(f'Errors: {len(errors)}')

    if errors:
        for name, err in errors[:10]:
            print(f'  {name}: {err}')

    # Verify with node -c on 30 random samples
    print('\n--- Syntax check (node -c) on 30 samples ---')
    all_scripts = [os.path.join(a, 'script.js') for a in apps]
    samples = random.sample(all_scripts, min(30, len(all_scripts)))

    pass_count = 0
    fail_count = 0
    for s in samples:
        result = subprocess.run(['node', '-c', s], capture_output=True, text=True)
        if result.returncode == 0:
            pass_count += 1
        else:
            fail_count += 1
            print(f'  FAIL: {s}')
            print(f'    {result.stderr[:200]}')

    print(f'\nSyntax check: {pass_count} pass, {fail_count} fail')

    print(f'\n=== SUMMARY ===')
    print(f'Total apps found: {len(apps)}')
    print(f'Successfully modified: {processed}')
    print(f'Skipped (already had features): {skipped}')
    print(f'Errors during processing: {len(errors)}')
    print(f'Syntax validation: {pass_count}/{len(samples)} passed')


if __name__ == '__main__':
    main()
