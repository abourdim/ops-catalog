#!/usr/bin/env python3
"""
Final pass: fix bugs and add per-app wiki content.
1. Fix Arabic text leaked into EN FAQ answers (268 apps)
2. Fix awkward FAQ_a2 grammar
3. Add 4 wiki entries to apps that have <3 wiki topics
4. Generate wiki entries from app title + category context
"""

import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))

CATEGORY_DOMAINS = {
    '01': {'field': 'covert operations', 'hw': 'BBC micro:bit V2'},
    '02': {'field': 'covert operations', 'hw': 'ESP32'},
    '03': {'field': 'digital security', 'hw': 'Browser only'},
    '04': {'field': 'covert operations', 'hw': 'Mixed'},
    '05': {'field': 'networking', 'hw': 'ESP32'},
    '06': {'field': 'networking', 'hw': 'Browser only'},
    '07': {'field': 'networking', 'hw': 'BBC micro:bit V2'},
    '08': {'field': 'distributed networks', 'hw': 'ESP32 x3+'},
    '09': {'field': 'advanced networking', 'hw': 'Mixed'},
    '10': {'field': 'signal intelligence', 'hw': 'HackRF One'},
    '11': {'field': 'RF exploration', 'hw': 'HackRF + micro:bit'},
    '12': {'field': 'RF engineering', 'hw': 'HackRF + ESP32'},
    '13': {'field': 'RF surveillance', 'hw': 'HackRF One'},
    '14': {'field': 'WiFi reconnaissance', 'hw': 'WiFi adapter'},
    '15': {'field': 'WiFi monitoring', 'hw': 'WiFi adapter'},
    '16': {'field': 'wireless security', 'hw': 'WiFi + HackRF'},
    '17': {'field': 'WiFi education', 'hw': 'WiFi adapter'},
    '18': {'field': 'IoT wireless', 'hw': 'WiFi + ESP32'},
    '19': {'field': 'amateur radio', 'hw': 'HackRF One'},
    '20': {'field': 'digital radio modes', 'hw': 'HackRF One'},
    '21': {'field': 'satellite communication', 'hw': 'HackRF One'},
    '22': {'field': 'amateur radio', 'hw': 'HackRF + micro:bit'},
    '23': {'field': 'amateur radio', 'hw': 'HackRF + ESP32'},
    '24': {'field': 'emergency communication', 'hw': 'Mixed'},
    '25': {'field': 'radio learning', 'hw': 'HackRF One'},
    '26': {'field': 'advanced amateur radio', 'hw': 'Full stack'},
    '27': {'field': 'digital signal processing', 'hw': 'HackRF One'},
    '28': {'field': 'multi-receiver SDR', 'hw': 'HackRF x2+'},
    '29': {'field': 'aviation and maritime signals', 'hw': 'HackRF One'},
    '30': {'field': 'scientific radio', 'hw': 'HackRF One'},
    '31': {'field': 'IoT and industrial signals', 'hw': 'HackRF One'},
    '32': {'field': 'SDR tools', 'hw': 'HackRF One'},
    '33': {'field': 'SDR learning', 'hw': 'HackRF One'},
    '34': {'field': 'advanced SDR', 'hw': 'Full stack'},
    '35': {'field': 'antenna design', 'hw': 'HackRF One'},
    '36': {'field': 'antenna testing', 'hw': 'RPi + HackRF'},
    '37': {'field': 'embedded computing', 'hw': 'Raspberry Pi'},
    '38': {'field': 'antenna automation', 'hw': 'RPi + antenna'},
    '39': {'field': 'field agent technology', 'hw': 'RPi + mixed'},
    '40': {'field': 'tactical communication', 'hw': 'RPi + micro:bit'},
    '41': {'field': 'covert communication', 'hw': 'RPi + HackRF'},
    '42': {'field': 'advanced tradecraft', 'hw': 'Full stack'},
    '43': {'field': 'biomedical signals', 'hw': 'Mixed'},
    '44': {'field': 'acoustic science', 'hw': 'Mixed'},
    '45': {'field': 'time and frequency', 'hw': 'Mixed'},
    '46': {'field': 'swarm intelligence', 'hw': 'ESP32 / micro:bit'},
    '47': {'field': 'physics experiments', 'hw': 'HackRF / RPi'},
    '48': {'field': 'offensive security', 'hw': 'Mixed'},
    '49': {'field': 'AI and machine learning for radio', 'hw': 'RPi / HackRF'},
    '50': {'field': 'humanitarian technology', 'hw': 'Mixed'},
    '51': {'field': 'social engineering awareness', 'hw': 'Mixed'},
    '52': {'field': 'hardware security', 'hw': 'Mixed'},
    '53': {'field': 'cryptography', 'hw': 'Mixed'},
    '54': {'field': 'electronic warfare', 'hw': 'HackRF'},
    '55': {'field': 'counter-surveillance', 'hw': 'Mixed'},
}


def find_lang_block_bounds(js, lang):
    marker = f'...LANG_BASE.{lang}'
    start = js.find(marker)
    if start == -1:
        return None, None
    next_markers = []
    for other in ['en', 'fr', 'ar']:
        if other == lang:
            continue
        idx = js.find(f'...LANG_BASE.{other}', start + len(marker))
        if idx != -1:
            next_markers.append(idx)
    if next_markers:
        end = min(next_markers)
    else:
        end = js.find('\n};', start)
        if end == -1:
            end = len(js)
    return start, end


def inject_in_block(js, lang, keys):
    s, e = find_lang_block_bounds(js, lang)
    if s is None:
        return js
    block = js[s:e]
    for k, v in keys.items():
        sv = v.replace("\\", "\\\\").replace("'", "\\'")
        pattern = rf"({k})\s*:\s*'(?:[^'\\]|\\.)*'"
        new_block, cnt = re.subn(pattern, f"{k}:'{sv}'", block, count=1)
        if cnt > 0:
            block = new_block
    return js[:s] + block + js[e:]


def append_in_block(js, lang, keys):
    s, e = find_lang_block_bounds(js, lang)
    if s is None:
        return js
    block = js[s:e]
    parts = []
    for k, v in keys.items():
        sv = v.replace("\\", "\\\\").replace("'", "\\'")
        parts.append(f"{k}:'{sv}'")
    kstr = ','.join(parts)
    for anchor in ["codeExplain:'", "ch3Desc:'", "kidParent:'", "guideStatus:'", "purpose:'", "learnAgeVal:'", "faq_a8:'"]:
        idx = block.find(anchor)
        if idx == -1:
            continue
        i = idx + len(anchor)
        while i < len(block):
            if block[i] == '\\':
                i += 2
                continue
            if block[i] == "'":
                break
            i += 1
        pos = i + 1
        block = block[:pos] + ',' + kstr + block[pos:]
        return js[:s] + block + js[e:]
    return js


def get_en_block(js):
    s, e = find_lang_block_bounds(js, 'en')
    if s is None:
        return ''
    return js[s:e]


def extract_en_ctx(js):
    en = get_en_block(js)
    ctx = {}
    for key in ['title', 'subtitle', 'mainDesc', 'startScan',
                 'step1Title', 'step1Desc', 'step2Title', 'step2Desc',
                 'step3Title', 'step3Desc', 'step4Title', 'step4Desc',
                 'sectionA', 'sectionB']:
        m = re.search(rf"{key}:\s*'([^']*(?:\\'[^']*)*)'", en)
        if m:
            ctx[key] = m.group(1).replace("\\'", "'")
    return ctx


def fix_faq(js, ctx, cat_info):
    """Rebuild FAQ answers from EN context only — fixes Arabic leak and grammar."""
    title = ctx.get('title', 'This App')
    mainDesc = ctx.get('mainDesc', ctx.get('subtitle', 'a simulation'))
    field = cat_info.get('field', 'technology')
    hw = cat_info.get('hw', 'a computer')

    step1 = ctx.get('step1Desc', '')
    step2 = ctx.get('step2Desc', '')
    start_label = ctx.get('startScan', 'Start')

    # Build proper EN FAQ answers
    en_faq = {
        'faq_a1': f'{title} lets you {mainDesc.lower().rstrip(".")}. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',
        'faq_a2': f'The simulation models real {field} behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',
        'faq_a3': f'Press "{start_label}" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',
        'faq_a4': f'This app is based on real {field} principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',
        'faq_a5': f'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',
        'faq_a6': f'The simulation needs no hardware. To build the real project, you need {hw}. See the Device Code section for wiring diagrams and ready-to-use firmware.',
        'faq_a7': f'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',
    }

    # Find sibling apps for faq_a8
    return en_faq


def generate_wiki_entries(ctx, cat_info):
    """Generate 4 domain-specific wiki entries based on app title and category."""
    title = ctx.get('title', '')
    field = cat_info.get('field', 'technology')
    hw = cat_info.get('hw', '')
    mainDesc = ctx.get('mainDesc', '')
    step1 = ctx.get('step1Desc', '')
    step2 = ctx.get('step2Desc', '')

    # Parse title words to derive specific topics
    title_words = title.lower().split()

    en_wiki = {}
    fr_wiki = {}
    ar_wiki = {}

    # ── Wiki 1: What is [title]? — Core concept ──
    en_wiki['wiki_concept_title'] = f'🔬 What is {title}?'
    en_wiki['wiki_concept'] = f'{title} is a technique used in {field}. {mainDesc[0].upper() + mainDesc[1:] if mainDesc else title + " simulates real-world behavior"}. In professional settings, this technology requires {hw} and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.'

    fr_wiki['wiki_concept_title'] = f'🔬 Qu\'est-ce que {title} ?'
    fr_wiki['wiki_concept'] = f'{title} est une technique utilisée en {field}. Dans un contexte professionnel, cette technologie nécessite {hw} et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.'

    ar_wiki['wiki_concept_title'] = f'🔬 ما هو {title}؟'
    ar_wiki['wiki_concept'] = f'{title} هي تقنية تُستخدم في {field}. في البيئات المهنية، تتطلب هذه التقنية {hw} وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.'

    # ── Wiki 2: How it works — Workflow ──
    en_wiki['wiki_howworks_title'] = '⚙️ How It Works'
    if step1 and step2:
        en_wiki['wiki_howworks'] = f'The process has four stages. First: {step1.rstrip(".")}. Second: {step2.rstrip(".")}. The simulation runs these stages in real time, showing you intermediate results at each step. In real {field}, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.'
    else:
        en_wiki['wiki_howworks'] = f'The simulation processes data in real time through multiple stages. Each stage transforms the input using algorithms based on real {field} principles. You can observe intermediate results at each step, and the visualization updates continuously to show the current state of the system.'

    fr_wiki['wiki_howworks_title'] = '⚙️ Comment ça marche'
    fr_wiki['wiki_howworks'] = f'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de {field}. Tu peux observer les résultats intermédiaires à chaque étape.'

    ar_wiki['wiki_howworks_title'] = '⚙️ كيف يعمل'
    ar_wiki['wiki_howworks'] = f'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من {field}. يمكنك مراقبة النتائج الوسيطة في كل خطوة.'

    # ── Wiki 3: Real-world applications ──
    en_wiki['wiki_realworld_title'] = '🌍 Real-World Applications'
    en_wiki['wiki_realworld'] = f'{title} has practical applications in {field}. Professionals use similar techniques with {hw} in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.'

    fr_wiki['wiki_realworld_title'] = '🌍 Applications réelles'
    fr_wiki['wiki_realworld'] = f'{title} a des applications pratiques en {field}. Les professionnels utilisent des techniques similaires avec {hw}. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.'

    ar_wiki['wiki_realworld_title'] = '🌍 التطبيقات الحقيقية'
    ar_wiki['wiki_realworld'] = f'{title} له تطبيقات عملية في {field}. يستخدم المحترفون تقنيات مماثلة مع {hw}. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.'

    # ── Wiki 4: Safety & Privacy ──
    en_wiki['wiki_safety_title'] = '🛡️ Safety & Privacy'
    en_wiki['wiki_safety'] = f'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.'

    fr_wiki['wiki_safety_title'] = '🛡️ Sécurité et confidentialité'
    fr_wiki['wiki_safety'] = f'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.'

    ar_wiki['wiki_safety_title'] = '🛡️ الأمان والخصوصية'
    ar_wiki['wiki_safety'] = f'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.'

    return en_wiki, fr_wiki, ar_wiki


def process_app(app_dir):
    script_path = os.path.join(app_dir, 'script.js')
    if not os.path.exists(script_path):
        return False

    js = open(script_path, 'r', encoding='utf-8').read()
    ctx = extract_en_ctx(js)
    if not ctx.get('title'):
        return False

    rel = os.path.relpath(app_dir, ROOT)
    cat_num = rel.split(os.sep)[0].split('-')[0]
    cat_info = CATEGORY_DOMAINS.get(cat_num, {'field': 'technology', 'hw': 'a computer'})

    changed = False

    # ── 1. Fix Arabic leaked into EN FAQ ──
    en_block = get_en_block(js)
    has_arabic_in_en = False
    for m in re.finditer(r"faq_a\d:'([^']*)'", en_block):
        if re.search(r'[\u0600-\u06FF]', m.group(1)):
            has_arabic_in_en = True
            break

    if has_arabic_in_en:
        en_faq = fix_faq(js, ctx, cat_info)
        js = inject_in_block(js, 'en', en_faq)
        changed = True

    # Also fix the faq_a2 grammar issue (even without Arabic)
    m = re.search(r"faq_a2:'([^']*)'", en_block)
    if m and 'First you' in m.group(1) and m.group(1).count('you') >= 2:
        en_faq2 = {
            'faq_a2': f'The simulation models real {cat_info["field"]} behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.'
        }
        js = inject_in_block(js, 'en', en_faq2)
        changed = True

    # ── 2. Add wiki entries if < 3 ──
    wiki_count = len(re.findall(r"wiki_\w+_title:", en_block))
    if wiki_count < 3:
        en_wiki, fr_wiki, ar_wiki = generate_wiki_entries(ctx, cat_info)
        # Only add entries that don't already exist
        for k in list(en_wiki.keys()):
            if k in en_block:
                del en_wiki[k]
                fr_wiki.pop(k, None)
                ar_wiki.pop(k, None)

        if en_wiki:
            js = append_in_block(js, 'en', en_wiki)
            js = append_in_block(js, 'fr', fr_wiki)
            js = append_in_block(js, 'ar', ar_wiki)
            changed = True

    if changed:
        open(script_path, 'w', encoding='utf-8').write(js)

    return changed


def update_html_wiki(html_path):
    """Add wiki display elements for the new entries."""
    html = open(html_path, 'r', encoding='utf-8').read()

    if 'wiki_concept' in html:
        return False

    # Find the wiki section
    wiki_marker = 'id="helpWiki"'
    idx = html.find(wiki_marker)
    if idx == -1:
        return False

    # Find where wiki entries start (after the opening tag)
    content_start = html.find('>', idx) + 1

    # Build new wiki entry HTML
    new_entries = ''
    for key_base, icon in [('concept', '🔬'), ('howworks', '⚙️'), ('realworld', '🌍'), ('safety', '🛡️')]:
        title_key = f'wiki_{key_base}_title'
        content_key = f'wiki_{key_base}'
        new_entries += f'<div class="wiki-entry"><h3 data-i18n="{title_key}">{icon} Topic</h3><p data-i18n="{content_key}">Loading...</p></div>'

    html = html[:content_start] + new_entries + html[content_start:]
    open(html_path, 'w', encoding='utf-8').write(html)
    return True


def main():
    js_count = 0
    html_count = 0
    errors = []

    for cat_dir in sorted(os.listdir(ROOT)):
        cat_path = os.path.join(ROOT, cat_dir)
        if not os.path.isdir(cat_path) or not cat_dir[0].isdigit():
            continue

        for app_name in sorted(os.listdir(cat_path)):
            app_dir = os.path.join(cat_path, app_name)
            if not os.path.isdir(app_dir):
                continue
            script_path = os.path.join(app_dir, 'script.js')
            html_path = os.path.join(app_dir, 'index.html')
            if not os.path.exists(script_path) or not os.path.exists(html_path):
                continue
            try:
                if process_app(app_dir):
                    js_count += 1
                if update_html_wiki(html_path):
                    html_count += 1
            except Exception as e:
                errors.append(f'{app_name}: {e}')

    print(f'Fixed/enriched {js_count} script.js, {html_count} index.html')
    if errors:
        print(f'{len(errors)} errors:')
        for e in errors[:20]:
            print(f'  {e}')


if __name__ == '__main__':
    main()
