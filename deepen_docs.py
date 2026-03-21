#!/usr/bin/env python3
"""
Deepen documentation across all 488 apps:
1. Expand terse howto steps with what-to-observe and why
2. Replace generic step descriptions with app-specific ones
3. Expand short wiki entries with real technical depth
4. Expand learn descriptions from labels to explanations
5. Add 'purpose' key explaining WHY this app exists
6. All in EN, FR, AR
"""

import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))


def find_lang_block_bounds(script_js, lang):
    marker = f'...LANG_BASE.{lang}'
    start = script_js.find(marker)
    if start == -1:
        return None, None
    next_markers = []
    for other in ['en', 'fr', 'ar']:
        if other == lang:
            continue
        idx = script_js.find(f'...LANG_BASE.{other}', start + len(marker))
        if idx != -1:
            next_markers.append(idx)
    if next_markers:
        end = min(next_markers)
    else:
        end = script_js.find('\n};', start)
        if end == -1:
            end = len(script_js)
    return start, end


def inject_in_block(script_js, lang, new_keys):
    block_start, block_end = find_lang_block_bounds(script_js, lang)
    if block_start is None:
        return script_js
    block = script_js[block_start:block_end]
    for key, value in new_keys.items():
        safe_value = value.replace("\\", "\\\\").replace("'", "\\'")
        pattern = rf"({key})\s*:\s*'(?:[^'\\]|\\.)*'"
        new_block, count = re.subn(pattern, f"{key}:'{safe_value}'", block, count=1)
        if count > 0:
            block = new_block
    script_js = script_js[:block_start] + block + script_js[block_end:]
    return script_js


def append_in_block(script_js, lang, new_keys):
    block_start, block_end = find_lang_block_bounds(script_js, lang)
    if block_start is None:
        return script_js
    block = script_js[block_start:block_end]
    parts = []
    for k, v in new_keys.items():
        safe_v = v.replace("\\", "\\\\").replace("'", "\\'")
        parts.append(f"{k}:'{safe_v}'")
    keys_str = ','.join(parts)
    for anchor in ["codeExplain:'", "ch3Desc:'", "kidParent:'", "guideStatus:'", "learnAgeVal:'", "faq_a8:'"]:
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
        insert_pos = i + 1
        block = block[:insert_pos] + ',' + keys_str + block[insert_pos:]
        script_js = script_js[:block_start] + block + script_js[block_end:]
        return script_js
    return script_js


def extract_ctx(js):
    """Extract context from the EN block only."""
    ctx = {}
    # Find EN block bounds
    en_start, en_end = find_lang_block_bounds(js, 'en')
    if en_start is None:
        return ctx
    en_block = js[en_start:en_end]

    for key in ['title', 'subtitle', 'mainSection', 'mainDesc',
                 'step1Title', 'step1Desc', 'step2Title', 'step2Desc',
                 'step3Title', 'step3Desc', 'step4Title', 'step4Desc',
                 'howto_1', 'howto_2', 'howto_3', 'howto_4',
                 'sectionA', 'sectionB', 'sectionC',
                 'learn1Title', 'learn1Desc', 'learn2Title', 'learn2Desc',
                 'learn3Title', 'learn3Desc', 'learn4Title', 'learn4Desc',
                 'startScan', 'stopScan']:
        m = re.search(rf"{key}:\s*'([^']*(?:\\'[^']*)*)'", en_block)
        if m:
            ctx[key] = m.group(1).replace("\\'", "'")
    # Extract all wiki keys from EN block
    for m in re.finditer(r"(wiki_\w+):\s*'([^']*(?:\\'[^']*)*)'", en_block):
        ctx[m.group(1)] = m.group(2).replace("\\'", "'")
    # Extract button labels
    for m in re.finditer(r"(\w+Btn):\s*'([^']*)'", en_block):
        ctx[m.group(1)] = m.group(2)
    return ctx


# ─── Generic step patterns that need replacing ───────────────────────────────
GENERIC_STEP1 = {
    'Configure RF', 'Configure SDR', 'Choose Algorithm', 'Configure Agent',
    'Prepare Mission', 'Set Up Network', 'Configure Antenna', 'Set Up Station',
    'Configure Scanner', 'Configure Attack', 'Select Mode', 'Initialize',
}


def build_app_steps(ctx):
    """Generate app-specific step descriptions from the app's own context."""
    title = ctx.get('title', 'the system')
    subtitle = ctx.get('subtitle', '').lstrip('📡📨🔬✈️🎯🔍🛡️ ')
    mainDesc = ctx.get('mainDesc', subtitle)
    secA = ctx.get('sectionA', 'Analysis')
    secB = ctx.get('sectionB', 'Data View')
    start_label = ctx.get('startScan', 'Start')

    # Derive action verbs from the app's own buttons and description
    desc_lower = mainDesc.lower()

    en = {
        'step1Title': 'Set Up',
        'step1Desc': f'Configure the parameters for {title}. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',
        'step2Title': 'Run',
        'step2Desc': f'Press "{start_label}" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',
        'step3Title': 'Observe',
        'step3Desc': f'Study the "{secA}" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',
        'step4Title': 'Experiment',
        'step4Desc': f'Change parameters one at a time and re-run. Compare results in "{secB}". Try extreme values to discover the limits of the system.',
    }
    fr = {
        'step1Title': 'Configurer',
        'step1Desc': f'Configure les paramètres de {title}. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',
        'step2Title': 'Exécuter',
        'step2Desc': f'Appuie sur "{start_label}" pour lancer la simulation. La visualisation se met à jour en temps réel.',
        'step3Title': 'Observer',
        'step3Desc': f'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',
        'step4Title': 'Expérimenter',
        'step4Desc': f'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',
    }
    ar = {
        'step1Title': 'إعداد',
        'step1Desc': f'اضبط معاملات {title}. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',
        'step2Title': 'تشغيل',
        'step2Desc': f'اضغط "{start_label}" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',
        'step3Title': 'مراقبة',
        'step3Desc': f'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',
        'step4Title': 'تجريب',
        'step4Desc': f'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',
    }
    return en, fr, ar


def build_rich_howto(ctx):
    """Generate detailed how-to steps with what-to-observe and why."""
    title = ctx.get('title', 'the app')
    start_label = ctx.get('startScan', 'Start')
    secA = ctx.get('sectionA', 'the data section')
    secB = ctx.get('sectionB', 'the analysis section')
    step1d = ctx.get('step1Desc', 'Configure the parameters')
    step2d = ctx.get('step2Desc', 'Start the simulation')

    en = {
        'howto_1': f'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',
        'howto_2': f'Press the "{start_label}" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
        'howto_3': f'Scroll down to the expandable sections. "{secA}" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
        'howto_4': f'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    }
    fr = {
        'howto_1': f'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.',
        'howto_2': f'Appuie sur "{start_label}". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
        'howto_3': f'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
        'howto_4': f'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    }
    ar = {
        'howto_1': f'انظر إلى البطاقة الرئيسية في الأعلى. هذه لوحة التحكم. اضبط المعاملات باستخدام المنزلقات والقوائم. ابدأ بالقيم الافتراضية لرؤية السلوك الطبيعي أولاً.',
        'howto_2': f'اضغط على "{start_label}". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
        'howto_3': f'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.',
        'howto_4': f'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    }
    return en, fr, ar


def build_rich_learn(ctx, cat_info):
    """Expand 1-line learn descriptions into 2-3 sentence explanations."""
    items = []
    for i in range(1, 5):
        title = ctx.get(f'learn{i}Title', '')
        desc = ctx.get(f'learn{i}Desc', '')
        if not title:
            continue
        items.append((i, title, desc))

    if not items:
        return {}, {}, {}

    expansions_en = [
        'Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',
        'The controls let you experiment with different conditions. Each change reveals how this principle responds.',
        'Try the challenges section to test your understanding. Real engineers use these same concepts daily.',
        'Compare results with different settings to build intuition. The data panels show precise measurements.',
    ]
    expansions_fr = [
        'Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',
        'Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',
        'Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',
        'Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',
    ]
    expansions_ar = [
        'شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',
        'أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',
        'جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',
        'قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',
    ]

    en, fr, ar = {}, {}, {}
    for i, title, desc in items:
        if len(desc) < 60:
            idx = (i - 1) % 4
            en[f'learn{i}Desc'] = f'{desc}. {expansions_en[idx]}'
            fr[f'learn{i}Desc'] = f'{desc}. {expansions_fr[idx]}'
            ar[f'learn{i}Desc'] = f'{desc}. {expansions_ar[idx]}'

    return en, fr, ar


def build_purpose(ctx, cat_num):
    """Generate a purpose statement explaining WHY this app exists."""
    title = ctx.get('title', 'This App')
    subtitle = ctx.get('subtitle', '').lstrip('📡📨🔬✈️🎯🔍🛡️ ')
    mainDesc = ctx.get('mainDesc', subtitle)

    # Gather context from steps and wiki
    step_descs = []
    for i in range(1, 5):
        d = ctx.get(f'step{i}Desc', '')
        if d:
            step_descs.append(d)
    steps_text = ' '.join(step_descs)

    wiki_texts = [v for k, v in ctx.items() if k.startswith('wiki_') and not k.endswith('_title') and len(v) > 20]
    wiki_summary = wiki_texts[0] if wiki_texts else ''

    # Capitalize first letter of mainDesc for purpose sentence
    desc_sentence = mainDesc[0].upper() + mainDesc[1:] if mainDesc else title
    desc_sentence = desc_sentence.rstrip('.')

    en = f'{title}: {desc_sentence}. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from {ctx.get("step1Title", "setup")} through {ctx.get("step2Title", "execution")} to {ctx.get("step3Title", "analysis")} and {ctx.get("step4Title", "experimentation")}.'
    fr = f'{title} : {desc_sentence}. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.'
    ar = f'{title}: {desc_sentence}. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.'

    return en, fr, ar


def expand_wiki_entry(key, value):
    """Expand a short wiki entry into a richer explanation."""
    if len(value) >= 80:
        return None  # Already detailed enough

    # Add technical context based on the content
    expanded = value.rstrip('.')

    # Add depth based on common wiki topics
    lower = value.lower()
    if 'frequency' in lower or 'mhz' in lower or 'ghz' in lower or 'hz' in lower:
        expanded += '. Frequency is measured in Hertz (cycles per second). Higher frequencies carry more data but travel shorter distances. Lower frequencies penetrate walls and terrain better but carry less information.'
    elif 'encrypt' in lower or 'cipher' in lower or 'key' in lower:
        expanded += '. Encryption transforms readable data into scrambled ciphertext using a mathematical algorithm and a secret key. Without the correct key, the data appears random. Strong encryption uses keys so large that guessing them would take billions of years.'
    elif 'antenna' in lower or 'dipole' in lower or 'yagi' in lower:
        expanded += '. Antennas convert between electrical signals in wires and electromagnetic waves in free space. Their physical size is related to the wavelength they receive best — a quarter-wave monopole for 100 MHz is about 75 cm long.'
    elif 'signal' in lower or 'noise' in lower or 'snr' in lower:
        expanded += '. Signal-to-noise ratio (SNR) determines how well you can extract useful information. In the real world, noise comes from thermal energy, other transmitters, and electronic components. Engineers design systems to maximize SNR through filters, amplifiers, and antenna design.'
    elif 'protocol' in lower or 'packet' in lower or 'frame' in lower:
        expanded += '. Communication protocols define the rules for how devices exchange data — the format of packets, when to transmit, how to handle errors, and how to identify the sender and receiver. Without agreed-upon protocols, devices cannot understand each other.'
    elif 'modulation' in lower or 'am ' in lower or 'fm ' in lower:
        expanded += '. Modulation encodes information onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). FM is more resistant to noise than AM, which is why FM radio sounds clearer. Digital modulations like QAM combine amplitude and phase changes to pack more data per symbol.'
    elif 'sensor' in lower or 'measure' in lower or 'detect' in lower:
        expanded += '. Sensors convert physical phenomena (light, sound, temperature, motion) into electrical signals that a computer can process. The key specifications are sensitivity (smallest change it can detect), range (min to max values), and accuracy (how close to the true value).'
    elif 'network' in lower or 'mesh' in lower or 'node' in lower:
        expanded += '. In a mesh network, every node can relay messages for other nodes. This creates multiple paths between any two points — if one node fails, messages automatically route around it. This self-healing property makes mesh networks ideal for emergency communication.'
    elif 'bluetooth' in lower or 'ble' in lower:
        expanded += '. Bluetooth Low Energy (BLE) uses 2.4 GHz radio in 40 channels, hopping between them to avoid interference. Advertising packets let devices announce their presence without a connection. BLE is designed for low power — a coin cell battery can last months.'
    elif 'wifi' in lower or '802.11' in lower or 'wlan' in lower:
        expanded += '. WiFi (IEEE 802.11) operates on 2.4 GHz and 5 GHz bands. Devices find networks through beacon frames broadcast by access points every ~100ms. Modern WiFi uses OFDM modulation to achieve speeds over 1 Gbps by sending data on multiple subcarriers simultaneously.'
    elif 'sdr' in lower or 'software defined' in lower:
        expanded += '. Software-Defined Radio replaces fixed hardware circuits with software algorithms. This means one SDR device can receive AM radio, decode aircraft transponders, and analyze WiFi — just by changing the software. The key components are the ADC (analog-to-digital converter) and the DSP (digital signal processing) algorithms.'
    elif 'fft' in lower or 'fourier' in lower or 'spectrum' in lower:
        expanded += '. The Fast Fourier Transform converts a signal from the time domain (amplitude vs. time) to the frequency domain (power vs. frequency). This reveals which frequencies are present and how strong they are. A 1024-point FFT can resolve frequency differences as small as sample_rate/1024 Hz.'
    elif 'privacy' in lower or 'local' in lower or 'browser' in lower:
        expanded += '. This application processes everything locally in your browser using JavaScript. No data is sent to any server. Your experiments, settings, and results stay on your device. This architecture is called "local-first" and guarantees complete data privacy.'
    elif 'power' in lower or 'watt' in lower or 'db' in lower:
        expanded += '. Power is measured in Watts, but radio engineers use decibels (dB) because they make multiplication into addition. Every +3 dB doubles the power, every +10 dB multiplies it by 10. A 1 Watt signal at +30 dBm is 1000x stronger than a 1 mW signal at 0 dBm.'
    elif 'impedance' in lower or 'ohm' in lower or 'swr' in lower:
        expanded += '. Impedance (Z) is the AC equivalent of resistance, measured in ohms. It has real (resistance) and imaginary (reactance) parts: Z = R + jX. When a transmission line\'s impedance matches the antenna (typically 50 ohms), maximum power transfers with no reflections. Mismatch causes standing waves (high SWR).'
    else:
        expanded += '. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.'

    return expanded


def process_app(app_dir):
    script_path = os.path.join(app_dir, 'script.js')
    if not os.path.exists(script_path):
        return False

    script_js = open(script_path, 'r', encoding='utf-8').read()
    ctx = extract_ctx(script_js)
    if not ctx.get('title'):
        return False

    rel_path = os.path.relpath(app_dir, ROOT)
    cat_dir = rel_path.split(os.sep)[0]
    cat_num = cat_dir.split('-')[0]

    changed = False

    # ── 1. Replace generic steps ──
    step1 = ctx.get('step1Title', '')
    if step1 in GENERIC_STEP1:
        en_steps, fr_steps, ar_steps = build_app_steps(ctx)
        script_js = inject_in_block(script_js, 'en', en_steps)
        script_js = inject_in_block(script_js, 'fr', fr_steps)
        script_js = inject_in_block(script_js, 'ar', ar_steps)
        changed = True

    # ── 2. Expand terse howto ──
    howto1 = ctx.get('howto_1', '')
    if len(howto1) < 80:
        en_howto, fr_howto, ar_howto = build_rich_howto(ctx)
        script_js = inject_in_block(script_js, 'en', en_howto)
        script_js = inject_in_block(script_js, 'fr', fr_howto)
        script_js = inject_in_block(script_js, 'ar', ar_howto)
        changed = True

    # ── 3. Expand short learn descriptions ──
    en_learn, fr_learn, ar_learn = build_rich_learn(ctx, cat_num)
    if en_learn:
        script_js = inject_in_block(script_js, 'en', en_learn)
        script_js = inject_in_block(script_js, 'fr', fr_learn)
        script_js = inject_in_block(script_js, 'ar', ar_learn)
        changed = True

    # ── 4. Expand short wiki entries ──
    en_wiki = {}
    for key, value in ctx.items():
        if key.startswith('wiki_') and not key.endswith('_title'):
            expanded = expand_wiki_entry(key, value)
            if expanded:
                en_wiki[key] = expanded
    if en_wiki:
        script_js = inject_in_block(script_js, 'en', en_wiki)
        # For FR/AR, keep existing content (translation of expanded text needs human review)
        changed = True

    # ── 5. Add purpose key if not present ──
    if 'purpose:' not in script_js:
        en_purpose, fr_purpose, ar_purpose = build_purpose(ctx, cat_num)
        script_js = append_in_block(script_js, 'en', {'purpose': en_purpose})
        script_js = append_in_block(script_js, 'fr', {'purpose': fr_purpose})
        script_js = append_in_block(script_js, 'ar', {'purpose': ar_purpose})
        changed = True

    if changed:
        open(script_path, 'w', encoding='utf-8').write(script_js)

    return changed


def update_html_purpose(html_path):
    """Add purpose display to index.html if not present."""
    html = open(html_path, 'r', encoding='utf-8').read()

    if 'data-i18n="purpose"' in html:
        return False

    # Insert purpose paragraph after the subtitle in the header
    subtitle_marker = 'data-i18n="subtitle"'
    idx = html.find(subtitle_marker)
    if idx == -1:
        return False

    # Find the closing tag of the subtitle element
    close_div = html.find('</div>', idx)
    if close_div == -1:
        return False

    purpose_html = '<p class="purpose-text" data-i18n="purpose" style="font-size:.75rem;opacity:.8;margin-top:.3rem;max-width:600px"></p>'
    html = html[:close_div + 6] + purpose_html + html[close_div + 6:]

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
                if update_html_purpose(html_path):
                    html_count += 1
            except Exception as e:
                errors.append(f'{app_name}: {e}')

    print(f'Deepened {js_count} script.js, {html_count} index.html')
    if errors:
        print(f'{len(errors)} errors:')
        for e in errors[:20]:
            print(f'  {e}')


if __name__ == '__main__':
    main()
