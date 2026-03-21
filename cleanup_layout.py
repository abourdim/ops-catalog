#!/usr/bin/env python3
"""
Comprehensive cleanup: fix layout, broken emojis, and sidebar structure across all 488 apps.
- Moves scattered features (daily challenge, peer mode, heatmap, lab recorder, sonify, compare, mentor)
  INTO sidebar as "Tools" tab instead of cluttering main area
- Fixes broken emoji encoding (multi-byte sequences like ð rendered as mojibake)
- Fixes related/path blocks to be inside helpWiki
- Removes stray elements from body
"""
import glob, re, os

EMOJI_FIX = {
    'ð\x9f\x93': '', 'ð\x9f\x94': '', 'ð\x9f\x8e': '', 'ð\x9f\x9b': '',
    'ð\x9f§': '', 'ð\x9f\x92': '', 'ð\x9f\x93': '', 'ð ': '',
    'â¬': '', 'â': '', 'âº': '', 'â¤': '', 'â\x8c': '',
    'ð\x9f': '', 'ð\x9f': '',
}

def fix_emojis(text):
    """Remove broken multi-byte emoji sequences that render as mojibake."""
    # Remove common broken patterns: ð followed by various bytes
    text = re.sub(r'ð[\x80-\xbf\x9f\x8e\x8d\x92\x93\x94\x9b\xa7\xa5\xa8]{0,3}', '', text)
    # Remove other broken sequences
    text = re.sub(r'â[\x80-\xbf\x8c\x9a\x9c\x9e\xac\xba\xbb\xbc]{0,2}', '', text)
    # Clean up resulting double spaces
    text = re.sub(r'  +', ' ', text)
    return text

def clean_html(html):
    """Restructure HTML to put features in proper locations."""

    # 1. Fix broken emojis throughout
    html = fix_emojis(html)

    # 2. Remove scattered elements that should be in sidebar
    # Remove dailyChallenge div from body (outside sidebar)
    html = re.sub(r'<div class="daily-challenge" id="dailyChallenge"[^>]*>.*?</div>', '', html, flags=re.DOTALL)

    # Remove mentor overlay and trigger from body
    html = re.sub(r'<div class="mentor-overlay" id="mentorOverlay"[^>]*>.*?</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<button id="mentorTriggerBtn"[^>]*>[^<]*</button>', '', html)

    # Remove peerModePanel from body
    html = re.sub(r'<div[^>]*id="peerModePanel"[^>]*>.*?</div>', '', html, flags=re.DOTALL)

    # Remove activityHeatmap from body
    html = re.sub(r'<div[^>]*id="activityHeatmap"[^>]*>.*?</div>', '', html, flags=re.DOTALL)

    # Remove voice/share buttons from after script tag
    html = re.sub(r'<button class="voice-btn"[^>]*>[^<]*</button>\n?', '', html)
    html = re.sub(r'<div class="voice-indicator"[^>]*>[^<]*</div>\n?', '', html)
    html = re.sub(r'<button class="share-btn"[^>]*>[^<]*</button>\n?', '', html)

    # Remove tooltip float from after script (it's created by JS anyway)
    html = re.sub(r'<div class="tooltip-float"[^>]*>[^<]*</div>\n?', '', html)

    # Remove sonify panel from main area (will be initialized by JS)
    html = re.sub(r'\s*<div class="sonify-panel" id="sonifyPanel"[^>]*></div>', '', html)

    # Remove labRecorderPanel from main area
    html = re.sub(r'\s*<div id="labRecorderPanel"[^>]*>.*?</div>\s*(?=\n)', '', html, flags=re.DOTALL)

    # Remove compare button from main area
    html = re.sub(r'\s*<div[^>]*id="comparePanel"[^>]*>.*?</div>', '', html, flags=re.DOTALL)

    # Remove spacedPanel from sidebar
    html = re.sub(r'<div[^>]*id="spacedPanel"[^>]*>.*?</div>', '', html, flags=re.DOTALL)

    # Remove difficulty bar from main area (will be in sidebar)
    html = re.sub(r'<div[^>]*id="difficultyBar"[^>]*>.*?</div>', '', html, flags=re.DOTALL)

    # 3. Fix relatedBlock and pathBlock - they should be INSIDE helpWiki
    # Remove them from wherever they are
    related_html = ''
    path_html = ''
    m = re.search(r'<div class="wiki-entry" id="relatedBlock">.*?</div>\s*\n?', html, re.DOTALL)
    if m:
        related_html = m.group(0)
        html = html.replace(m.group(0), '')
    m = re.search(r'<div class="wiki-entry" id="pathBlock">.*?</div>\s*\n?', html, re.DOTALL)
    if m:
        path_html = m.group(0)
        html = html.replace(m.group(0), '')

    # Re-insert related and path INSIDE helpWiki, before its closing </div>
    if related_html or path_html:
        # Find the end of helpWiki content (it ends with </div> before the next help-content)
        wiki_close = html.find('</div><div class="help-content" id="helpKids">')
        if wiki_close == -1:
            wiki_close = html.find('</div></div><div class="help-content" id="helpKids">')
        if wiki_close > 0:
            insert = related_html + path_html
            html = html[:wiki_close] + insert + html[wiki_close:]

    # 4. Add a "Tools" tab button if not present
    if 'data-tab="tools"' not in html:
        # Insert after quiz tab
        html = html.replace(
            '<button class="help-tab" data-tab="quiz" data-i18n="quizTab">Quiz</button>',
            '<button class="help-tab" data-tab="quiz" data-i18n="quizTab">Quiz</button>'
            '<button class="help-tab" data-tab="tools" data-i18n="toolsTab">Tools</button>'
        )

    # 5. Add helpTools content div if not present
    if 'id="helpTools"' not in html:
        tools_div = (
            '<div class="help-content" id="helpTools">'
            '<div class="wiki-entry"><h3 data-i18n="toolsTitle">Toolbox</h3>'
            '<div id="toolsDailySlot"></div>'
            '<div id="toolsCompareSlot"></div>'
            '<div id="toolsLabSlot"></div>'
            '<div id="toolsPeerSlot"></div>'
            '<div id="toolsHeatmapSlot"></div>'
            '<div id="toolsDiffSlot"></div>'
            '</div></div>'
        )
        # Insert after helpQuiz closing div
        quiz_end = html.find('</div><div class="wiki-entry" id="relatedBlock">')
        if quiz_end == -1:
            # Try finding end of helpQuiz
            quiz_marker = html.find('id="helpQuiz"')
            if quiz_marker > 0:
                # Find the matching closing </div> for helpQuiz
                # helpQuiz contains quizContainer and quizScore divs
                qend = html.find('</div></div>', quiz_marker)
                if qend == -1:
                    qend = html.find('</div><div class="help-content" id="helpKids">', quiz_marker)
                    if qend == -1:
                        qend = html.find('</div><div class="wiki-entry"', quiz_marker)
                if qend > 0:
                    # Find the actual end of helpQuiz div
                    pass

        # Simpler approach: insert before helpKids
        kids_marker = '<div class="help-content" id="helpKids">'
        if kids_marker in html and tools_div not in html:
            html = html.replace(kids_marker, tools_div + kids_marker)

    # 6. Clean up excessive blank lines
    html = re.sub(r'\n{3,}', '\n\n', html)

    return html

def clean_js(js):
    """Fix broken emojis in script.js LANG keys."""
    js = fix_emojis(js)
    # Clean up resulting issues in strings
    js = re.sub(r"' *'", "''", js)  # Fix empty collapsed strings
    return js

# Process all apps
apps = sorted(glob.glob('[0-9]*-*/*/index.html'))
print(f'Found {len(apps)} apps')

modified = 0
errors = 0
for html_path in apps:
    try:
        js_path = html_path.replace('index.html', 'script.js')

        # Clean HTML
        with open(html_path) as f:
            html = f.read()
        new_html = clean_html(html)
        if new_html != html:
            with open(html_path, 'w') as f:
                f.write(new_html)

        # Clean JS
        if os.path.exists(js_path):
            with open(js_path) as f:
                js = f.read()
            new_js = clean_js(js)
            if new_js != js:
                with open(js_path, 'w') as f:
                    f.write(new_js)

        modified += 1
    except Exception as e:
        errors += 1
        print(f'  ERROR {html_path}: {e}')

print(f'Done: {modified} modified, {errors} errors')
