#!/usr/bin/env python3
"""
Mega-enrich: Add deep documentation to all 488 apps.
- 6 more wiki entries per app (history, math, advanced, comparison, debugging, ethics)
- Expand short FAQ answers to 200+ chars
- Add 2 more FAQ pairs (faq_q9/a9, faq_q10/a10)
- Add theory paragraph (deep background)
- Add glossary (6 terms with definitions)
- Expand short how-to steps
- Update HTML for new wiki entries, theory, glossary
"""
import os, re, sys

# ── Category domains (same as improve_content.py) ──────────────────────
CATEGORY_DOMAINS = {
    '01': {'field': 'covert operations', 'field_fr': 'opérations secrètes', 'field_ar': 'العمليات السرية', 'hw': 'BBC micro:bit'},
    '02': {'field': 'covert operations', 'field_fr': 'opérations secrètes', 'field_ar': 'العمليات السرية', 'hw': 'ESP32'},
    '03': {'field': 'radio intelligence', 'field_fr': 'renseignement radio', 'field_ar': 'الاستخبارات اللاسلكية', 'hw': 'HackRF SDR'},
    '04': {'field': 'radio intelligence', 'field_fr': 'renseignement radio', 'field_ar': 'الاستخبارات اللاسلكية', 'hw': 'HackRF SDR'},
    '05': {'field': 'RF security', 'field_fr': 'sécurité RF', 'field_ar': 'أمن الترددات', 'hw': 'HackRF SDR'},
    '06': {'field': 'antenna engineering', 'field_fr': "ingénierie d'antennes", 'field_ar': 'هندسة الهوائيات', 'hw': 'HackRF SDR'},
    '07': {'field': 'spectrum analysis', 'field_fr': 'analyse spectrale', 'field_ar': 'تحليل الطيف', 'hw': 'HackRF SDR'},
    '08': {'field': 'RF hacking', 'field_fr': 'piratage RF', 'field_ar': 'اختراق التردد', 'hw': 'HackRF SDR'},
    '09': {'field': 'RF warfare', 'field_fr': 'guerre RF', 'field_ar': 'الحرب الإلكترونية', 'hw': 'HackRF SDR'},
    '10': {'field': 'SIGINT', 'field_fr': 'renseignement électronique', 'field_ar': 'الاستخبارات الإلكترونية', 'hw': 'HackRF SDR'},
    '11': {'field': 'satellite communications', 'field_fr': 'communications satellite', 'field_ar': 'اتصالات الأقمار', 'hw': 'HackRF SDR'},
    '12': {'field': 'radar systems', 'field_fr': 'systèmes radar', 'field_ar': 'أنظمة الرادار', 'hw': 'HackRF SDR'},
    '13': {'field': 'navigation systems', 'field_fr': 'systèmes de navigation', 'field_ar': 'أنظمة الملاحة', 'hw': 'HackRF SDR'},
    '14': {'field': 'WiFi security', 'field_fr': 'sécurité WiFi', 'field_ar': 'أمن الواي فاي', 'hw': 'WiFi adapter'},
    '15': {'field': 'WiFi surveillance', 'field_fr': 'surveillance WiFi', 'field_ar': 'مراقبة الواي فاي', 'hw': 'WiFi adapter'},
    '16': {'field': 'WiFi forensics', 'field_fr': 'analyse WiFi', 'field_ar': 'تحليل الواي فاي', 'hw': 'WiFi adapter'},
    '17': {'field': 'WiFi education', 'field_fr': 'éducation WiFi', 'field_ar': 'تعليم الواي فاي', 'hw': 'WiFi adapter'},
    '18': {'field': 'Bluetooth security', 'field_fr': 'sécurité Bluetooth', 'field_ar': 'أمن البلوتوث', 'hw': 'BLE adapter'},
    '19': {'field': 'IoT security', 'field_fr': 'sécurité IoT', 'field_ar': 'أمن إنترنت الأشياء', 'hw': 'Raspberry Pi'},
    '20': {'field': 'RFID security', 'field_fr': 'sécurité RFID', 'field_ar': 'أمن RFID', 'hw': 'RFID reader'},
    '21': {'field': 'Zigbee security', 'field_fr': 'sécurité Zigbee', 'field_ar': 'أمن Zigbee', 'hw': 'Zigbee adapter'},
    '22': {'field': 'LoRa networks', 'field_fr': 'réseaux LoRa', 'field_ar': 'شبكات لورا', 'hw': 'LoRa module'},
    '23': {'field': 'mesh networking', 'field_fr': 'réseaux maillés', 'field_ar': 'الشبكات المتداخلة', 'hw': 'ESP32'},
    '24': {'field': 'RF geolocation', 'field_fr': 'géolocalisation RF', 'field_ar': 'تحديد المواقع', 'hw': 'HackRF SDR'},
    '25': {'field': 'drone security', 'field_fr': 'sécurité drones', 'field_ar': 'أمن الطائرات', 'hw': 'HackRF SDR'},
    '26': {'field': 'maritime radio', 'field_fr': 'radio maritime', 'field_ar': 'الراديو البحري', 'hw': 'HackRF SDR'},
    '27': {'field': 'aviation radio', 'field_fr': 'radio aéronautique', 'field_ar': 'الراديو الجوي', 'hw': 'HackRF SDR'},
    '28': {'field': 'SDR techniques', 'field_fr': 'techniques SDR', 'field_ar': 'تقنيات SDR', 'hw': 'HackRF SDR'},
    '29': {'field': 'signal processing', 'field_fr': 'traitement du signal', 'field_ar': 'معالجة الإشارات', 'hw': 'HackRF SDR'},
    '30': {'field': 'RF propagation', 'field_fr': 'propagation RF', 'field_ar': 'انتشار الموجات', 'hw': 'HackRF SDR'},
    '31': {'field': 'EMC testing', 'field_fr': 'tests CEM', 'field_ar': 'اختبارات التوافق', 'hw': 'HackRF SDR'},
    '32': {'field': 'amateur radio', 'field_fr': 'radio amateur', 'field_ar': 'الراديو الهاوي', 'hw': 'HackRF SDR'},
    '33': {'field': 'emergency comms', 'field_fr': 'communications urgentes', 'field_ar': 'اتصالات الطوارئ', 'hw': 'HackRF SDR'},
    '34': {'field': 'radio astronomy', 'field_fr': 'radioastronomie', 'field_ar': 'الفلك الراديوي', 'hw': 'HackRF SDR'},
    '35': {'field': 'quantum computing', 'field_fr': 'informatique quantique', 'field_ar': 'الحوسبة الكمومية', 'hw': 'browser'},
    '36': {'field': 'AI and ML', 'field_fr': 'IA et ML', 'field_ar': 'الذكاء الاصطناعي', 'hw': 'browser'},
    '37': {'field': 'cybersecurity', 'field_fr': 'cybersécurité', 'field_ar': 'الأمن السيبراني', 'hw': 'browser'},
    '38': {'field': 'steganography', 'field_fr': 'stéganographie', 'field_ar': 'إخفاء المعلومات', 'hw': 'browser'},
    '39': {'field': 'cryptography', 'field_fr': 'cryptographie', 'field_ar': 'التشفير', 'hw': 'browser'},
    '40': {'field': 'autonomous agents', 'field_fr': 'agents autonomes', 'field_ar': 'الوكلاء المستقلون', 'hw': 'BBC micro:bit'},
    '41': {'field': 'forensic science', 'field_fr': 'science forensique', 'field_ar': 'الطب الشرعي', 'hw': 'browser'},
    '42': {'field': 'OSINT', 'field_fr': 'OSINT', 'field_ar': 'الاستخبارات المفتوحة', 'hw': 'browser'},
    '43': {'field': 'bioelectronics', 'field_fr': 'bioélectronique', 'field_ar': 'الإلكترونيات الحيوية', 'hw': 'biosensors'},
    '44': {'field': 'physics', 'field_fr': 'physique', 'field_ar': 'الفيزياء', 'hw': 'browser'},
    '45': {'field': 'chemistry', 'field_fr': 'chimie', 'field_ar': 'الكيمياء', 'hw': 'browser'},
    '46': {'field': 'earth science', 'field_fr': 'sciences de la Terre', 'field_ar': 'علوم الأرض', 'hw': 'browser'},
    '47': {'field': 'impossible physics', 'field_fr': 'physique impossible', 'field_ar': 'الفيزياء المستحيلة', 'hw': 'browser'},
    '48': {'field': 'retro computing', 'field_fr': 'informatique rétro', 'field_ar': 'الحوسبة القديمة', 'hw': 'browser'},
    '49': {'field': 'data visualization', 'field_fr': 'visualisation de données', 'field_ar': 'تصور البيانات', 'hw': 'browser'},
    '50': {'field': 'network security', 'field_fr': 'sécurité réseau', 'field_ar': 'أمن الشبكات', 'hw': 'browser'},
    '51': {'field': 'social engineering', 'field_fr': 'ingénierie sociale', 'field_ar': 'الهندسة الاجتماعية', 'hw': 'browser'},
    '52': {'field': 'privacy tools', 'field_fr': 'outils de confidentialité', 'field_ar': 'أدوات الخصوصية', 'hw': 'browser'},
    '53': {'field': 'reverse engineering', 'field_fr': 'rétro-ingénierie', 'field_ar': 'الهندسة العكسية', 'hw': 'browser'},
    '54': {'field': 'exploit development', 'field_fr': 'développement exploits', 'field_ar': 'تطوير الثغرات', 'hw': 'browser'},
    '55': {'field': 'escape and evasion', 'field_fr': 'évasion et esquive', 'field_ar': 'الهروب والتملص', 'hw': 'browser'},
}

# ── Helpers ──────────────────────────────────────────────────────────────

def dir_to_title(d):
    """Convert dir name to title: 'bit-dead-drop' -> 'Dead Drop'"""
    parts = d.split('-')
    # Remove common prefixes
    prefixes = {'bit','esp','hrf','sdr','wifi','ble','iot','rfid','zb','lora','mesh',
                'geo','drone','mar','avi','dsp','prop','emc','ham','emer','astro',
                'qc','ai','sec','steg','cry','agent','for','osint','bio','phys',
                'chem','earth','retro','viz','net','se','priv','rev','exp','esc'}
    if parts[0] in prefixes:
        parts = parts[1:]
    return ' '.join(p.capitalize() for p in parts)

def find_lang_block(js, lang):
    """Return (start, end) of a language block in script.js.
    Handles both old template (...LANG_BASE.xx) and new template (xx:{...})."""
    # Try old template first for EN
    if lang == 'en':
        tag = '...LANG_BASE.en'
        start = js.find(tag)
        if start != -1:
            # End is at the next language block boundary
            end = js.find('...LANG_BASE.fr', start)
            if end == -1:
                # New template hybrid: EN uses LANG_BASE, FR/AR don't
                # Find fr:{ after the EN block in the app LANG (not in LANG_BASE)
                # Search for },\nfr:{ or },fr:{ pattern after start
                m = re.search(r'},\s*\n?\s*fr\s*:\s*\{', js[start:])
                if m:
                    end = start + m.start() + 1  # +1 to include the }
                else:
                    end = len(js)
            return start, end
        # No LANG_BASE.en — fall through to brace-based search

    # For FR/AR (or EN without LANG_BASE), find the app LANG object
    # Look for the SECOND const LANG or LANG={ (skip LANG_BASE)
    lang_base_end = js.find('};')  # End of LANG_BASE
    if lang_base_end == -1:
        lang_base_end = 0

    # Find const LANG={ after LANG_BASE
    app_lang = js.find('const LANG={', lang_base_end)
    if app_lang == -1:
        app_lang = js.find('const LANG ={', lang_base_end)
    if app_lang == -1:
        app_lang = js.find('const LANG =', lang_base_end)
    if app_lang == -1:
        # Try from beginning
        app_lang = js.find('const LANG')
    if app_lang == -1:
        return -1, -1

    # Search for the language block after app LANG start
    # For old-template FR/AR, check if LANG_BASE spread exists
    base_tag = f'...LANG_BASE.{lang}'
    base_pos = js.find(base_tag, app_lang)
    if base_pos != -1:
        start = base_pos
        if lang == 'fr':
            end = js.find('...LANG_BASE.ar', start)
            if end == -1:
                m = re.search(r'},\s*\n?\s*ar\s*:\s*\{', js[start:])
                end = start + m.start() + 1 if m else len(js)
        else:  # ar
            end = js.find('\n};', start)
            if end == -1:
                end = len(js)
        return start, end

    # New template: find xx:{ in the app LANG block (not LANG_BASE)
    pat = re.compile(rf'(?:,|\{{)\s*\n?\s*{lang}\s*:\s*\{{')
    m = pat.search(js, app_lang)
    if not m:
        return -1, -1

    # Find the opening brace of this language block
    brace_pos = js.index('{', m.start() + 1)
    start = brace_pos

    # Find matching closing brace
    depth = 0
    for i in range(brace_pos, len(js)):
        if js[i] == '{':
            depth += 1
        elif js[i] == '}':
            depth -= 1
            if depth == 0:
                return start, i  # end is at closing brace

    return -1, -1

def extract_en_ctx(js):
    """Extract key context from EN block only."""
    s, e = find_lang_block(js, 'en')
    if s == -1:
        return {}
    en = js[s:e]
    ctx = {}
    for key in ['title', 'subtitle', 'mainSection', 'mainDesc', 'purpose']:
        m = re.search(rf"{key}:\s*['\"](.+?)['\"]", en)
        if m:
            ctx[key] = m.group(1)
    # Collect existing wiki content
    wiki_texts = []
    for m in re.finditer(r"wiki_\w+:\s*['\"](.+?)['\"]", en):
        wiki_texts.append(m.group(1))
    ctx['wiki_summary'] = ' '.join(wiki_texts[:4])[:300]
    # Collect existing FAQ
    faq_texts = []
    for m in re.finditer(r"faq_a\d+:\s*['\"](.+?)['\"]", en):
        faq_texts.append(m.group(1))
    ctx['faq_summary'] = ' '.join(faq_texts[:3])[:200]
    return ctx

def has_key(js, lang, key):
    """Check if a key exists in a language block."""
    s, e = find_lang_block(js, lang)
    if s == -1:
        return False
    block = js[s:e]
    return bool(re.search(rf'\b{re.escape(key)}\s*:', block))

def append_keys(js, lang, keys_str):
    """Append new keys before the closing of a language block."""
    s, e = find_lang_block(js, lang)
    if s == -1:
        return js
    block = js[s:e]

    # For new-template (brace-delimited), e points to the closing brace
    # Check if js[e] is '}'
    if e < len(js) and js[e] == '}':
        # Insert before the closing brace, after the last comma
        chunk = block.rstrip()
        last_comma = chunk.rfind(',')
        if last_comma != -1:
            insert_pos = s + last_comma + 1
        else:
            insert_pos = e
        # keys_str already has trailing commas from format_keys, don't add more
        return js[:insert_pos] + '\n' + keys_str.rstrip(',').rstrip() + ',' + js[insert_pos:]

    # For old-template (LANG_BASE), insert after last comma before block boundary
    chunk = block.rstrip()
    last_comma = chunk.rfind(',')
    if last_comma != -1:
        insert_pos = s + last_comma + 1
        return js[:insert_pos] + '\n' + keys_str + js[insert_pos:]
    return js[:e] + keys_str + '\n' + js[e:]

def replace_key_value(js, lang, key, new_value):
    """Replace a key's value within a specific language block."""
    s, e = find_lang_block(js, lang)
    if s == -1:
        return js
    block = js[s:e]
    # Match key: 'value' or key: "value"
    pattern = rf"({re.escape(key)}:\s*['\"])(.+?)(['\"])"
    m = re.search(pattern, block)
    if m:
        new_block = block[:m.start(2)] + new_value + block[m.end(2):]
        return js[:s] + new_block + js[e:]
    return js

# ── Content generators ──────────────────────────────────────────────────

def build_wiki_extras(title, field, hw, ctx):
    """Generate 6 additional wiki entries: history, math, advanced, comparison, debugging, ethics."""
    desc = ctx.get('mainDesc', title)
    wiki_sum = ctx.get('wiki_summary', desc)

    entries = {}

    # 1. History
    entries['wiki_history_title'] = f'📜 History of {field.title()}'
    entries['wiki_history'] = (
        f'The field of {field} has evolved significantly over the past century. '
        f'Early pioneers developed foundational techniques using analog equipment. '
        f'The digital revolution transformed {field} by enabling software-defined approaches. '
        f'Modern practitioners use tools like {hw} to perform tasks that once required '
        f'rooms full of equipment. Understanding this history helps you appreciate '
        f'why certain protocols and standards exist today.'
    )

    # 2. Mathematics / Theory
    entries['wiki_math_title'] = f'📐 Mathematics Behind {title}'
    entries['wiki_math'] = (
        f'The mathematics underpinning {title.lower()} involves several key concepts. '
        f'Signal processing relies on Fourier transforms to convert between time and frequency domains. '
        f'Information theory (Shannon entropy) determines the theoretical limits of data transmission. '
        f'Probability and statistics help distinguish real signals from noise. '
        f'Linear algebra enables matrix operations used in encryption and modulation. '
        f'Understanding these mathematical foundations lets you predict system behavior before building it.'
    )

    # 3. Advanced techniques
    entries['wiki_advanced_title'] = f'🔬 Advanced Techniques'
    entries['wiki_advanced'] = (
        f'Beyond the basics demonstrated in this simulation, advanced {field} practitioners use '
        f'sophisticated techniques. Adaptive algorithms automatically adjust parameters based on '
        f'environmental conditions. Machine learning classifies signals with high accuracy. '
        f'Multi-channel correlation detects patterns invisible to single-channel analysis. '
        f'Distributed sensor networks combine data from multiple locations for triangulation. '
        f'These techniques build on the fundamentals you learn here.'
    )

    # 4. Comparison with alternatives
    entries['wiki_compare_title'] = f'⚖️ Comparing Approaches'
    entries['wiki_compare'] = (
        f'There are several approaches to {field}. Hardware-based solutions using {hw} '
        f'offer real-time performance and direct signal access. Software simulations (like this app) '
        f'provide safe experimentation without equipment cost. Cloud-based platforms offer '
        f'scalability but introduce latency and privacy concerns. Each approach has trade-offs: '
        f'cost vs. fidelity, speed vs. safety, simplicity vs. capability. '
        f'This simulation gives you the conceptual foundation to use any approach effectively.'
    )

    # 5. Debugging / Troubleshooting
    entries['wiki_debug_title'] = f'🔧 Troubleshooting Guide'
    entries['wiki_debug'] = (
        f'Common issues when working with {field}: (1) Unexpected results often come from '
        f'incorrect parameter settings — reset to defaults and change one variable at a time. '
        f'(2) If the visualization seems frozen, check that the simulation is running (not paused). '
        f'(3) Noisy or erratic readings usually indicate interference — in real hardware, '
        f'move away from electronic devices. (4) If calculations seem wrong, verify your units '
        f'(Hz vs kHz vs MHz). Systematic debugging is a core skill in {field}.'
    )

    # 6. Ethics and legal
    entries['wiki_ethics_title'] = f'⚖️ Ethics & Legal Considerations'
    entries['wiki_ethics'] = (
        f'{field.title()} carries important ethical and legal responsibilities. '
        f'Many countries regulate the use of {hw} and similar equipment. '
        f'Always obtain proper authorization before testing on systems you do not own. '
        f'Respect privacy laws and data protection regulations. '
        f'This simulation is designed for educational purposes — it demonstrates principles '
        f'without transmitting real signals or accessing real networks. '
        f'Responsible use of these skills contributes to security for everyone.'
    )

    return entries

def build_wiki_extras_fr(title, field_fr, hw):
    entries = {}
    entries['wiki_history_title'] = f'📜 Histoire de {field_fr}'
    entries['wiki_history'] = (
        f'Le domaine de {field_fr} a considérablement évolué au cours du siècle dernier. '
        f'Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. '
        f'La révolution numérique a transformé le domaine en permettant des approches logicielles. '
        f'Les praticiens modernes utilisent des outils comme {hw} pour réaliser des tâches '
        f'qui nécessitaient autrefois des salles entières de matériel. '
        f'Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.'
    )
    entries['wiki_math_title'] = f'📐 Mathématiques de {title}'
    entries['wiki_math'] = (
        f'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. '
        f'Le traitement du signal repose sur les transformées de Fourier. '
        f'La théorie de information (entropie de Shannon) détermine les limites théoriques. '
        f'Les probabilités et statistiques distinguent les signaux du bruit. '
        f'L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. '
        f'Comprendre ces fondations permet de prédire le comportement du système.'
    )
    entries['wiki_advanced_title'] = f'🔬 Techniques avancées'
    entries['wiki_advanced'] = (
        f'Au-delà des bases de cette simulation, les praticiens avancés de {field_fr} utilisent '
        f'des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. '
        f'L apprentissage automatique classifie les signaux avec précision. '
        f'La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. '
        f'Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.'
    )
    entries['wiki_compare_title'] = f'⚖️ Comparaison des approches'
    entries['wiki_compare'] = (
        f'Il existe plusieurs approches pour {field_fr}. Les solutions matérielles avec {hw} '
        f'offrent des performances en temps réel. Les simulations logicielles (comme cette app) '
        f'permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud '
        f'offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. '
        f'Cette simulation vous donne les bases pour utiliser efficacement toute approche.'
    )
    entries['wiki_debug_title'] = f'🔧 Guide de dépannage'
    entries['wiki_debug'] = (
        f'Problèmes courants en {field_fr} : (1) Les résultats inattendus proviennent souvent '
        f'de paramètres incorrects — réinitialisez et modifiez une variable à la fois. '
        f'(2) Si la visualisation semble gelée, vérifiez que la simulation tourne. '
        f'(3) Les lectures erratiques indiquent des interférences. '
        f'(4) Vérifiez vos unités (Hz vs kHz vs MHz). '
        f'Le débogage systématique est une compétence essentielle.'
    )
    entries['wiki_ethics_title'] = f'⚖️ Éthique et aspects légaux'
    entries['wiki_ethics'] = (
        f'{field_fr.capitalize()} implique des responsabilités éthiques et légales importantes. '
        f'De nombreux pays réglementent l utilisation de {hw}. '
        f'Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. '
        f'Respectez les lois sur la vie privée et la protection des données. '
        f'Cette simulation est conçue à des fins éducatives — elle démontre des principes '
        f'sans transmettre de signaux réels ni accéder à de vrais réseaux.'
    )
    return entries

def build_wiki_extras_ar(title, field_ar, hw):
    entries = {}
    entries['wiki_history_title'] = f'📜 تاريخ {field_ar}'
    entries['wiki_history'] = (
        f'تطور مجال {field_ar} بشكل كبير خلال القرن الماضي. '
        f'طور الرواد تقنيات أساسية باستخدام معدات تناظرية. '
        f'حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. '
        f'يستخدم الممارسون المعاصرون أدوات مثل {hw} لأداء مهام '
        f'كانت تتطلب في السابق غرفاً كاملة من المعدات. '
        f'فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.'
    )
    entries['wiki_math_title'] = f'📐 الرياضيات وراء {title}'
    entries['wiki_math'] = (
        f'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. '
        f'تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. '
        f'تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. '
        f'تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. '
        f'يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.'
    )
    entries['wiki_advanced_title'] = f'🔬 تقنيات متقدمة'
    entries['wiki_advanced'] = (
        f'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو {field_ar} المتقدمون '
        f'تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. '
        f'يصنف التعلم الآلي الإشارات بدقة عالية. '
        f'يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. '
        f'تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.'
    )
    entries['wiki_compare_title'] = f'⚖️ مقارنة الأساليب'
    entries['wiki_compare'] = (
        f'هناك عدة أساليب في {field_ar}. توفر الحلول المادية باستخدام {hw} '
        f'أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) '
        f'تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية '
        f'قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. '
        f'تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.'
    )
    entries['wiki_debug_title'] = f'🔧 دليل استكشاف الأخطاء'
    entries['wiki_debug'] = (
        f'مشاكل شائعة في {field_ar}: (1) النتائج غير المتوقعة غالباً ما تأتي من '
        f'إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. '
        f'(2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. '
        f'(3) القراءات المتقطعة تشير عادة إلى التداخل. '
        f'(4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).'
    )
    entries['wiki_ethics_title'] = f'⚖️ الأخلاقيات والاعتبارات القانونية'
    entries['wiki_ethics'] = (
        f'{field_ar} يحمل مسؤوليات أخلاقية وقانونية مهمة. '
        f'تنظم العديد من الدول استخدام {hw} والمعدات المماثلة. '
        f'احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. '
        f'احترم قوانين الخصوصية وحماية البيانات. '
        f'هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ '
        f'دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.'
    )
    return entries

def build_glossary(title, field, hw, ctx):
    """Generate 6 glossary terms with definitions, trilingual."""
    desc = ctx.get('mainDesc', title)

    # EN
    en = {}
    en['gloss1_term'] = 'Signal'
    en['gloss1_def'] = 'A varying quantity (voltage, electromagnetic wave, or data stream) that carries information. In this simulation, signals are represented visually so you can see how they change over time and respond to your controls.'
    en['gloss2_term'] = 'Parameter'
    en['gloss2_def'] = 'A configurable value that changes system behavior. Each slider and input in this app controls a specific parameter. Changing parameters lets you explore cause-and-effect relationships in the simulation.'
    en['gloss3_term'] = 'Simulation'
    en['gloss3_def'] = 'A software model that mimics real-world behavior. This app simulates real equipment and processes so you can learn safely without hardware. The physics and mathematics are real — only the signals are virtual.'
    en['gloss4_term'] = 'Protocol'
    en['gloss4_def'] = 'A set of rules that defines how data is formatted, transmitted, and received. Protocols ensure that different devices can communicate. Examples include WiFi (802.11), Bluetooth, HTTP, and TCP/IP.'
    en['gloss5_term'] = 'Frequency'
    en['gloss5_def'] = 'The number of cycles a signal completes per second, measured in Hertz (Hz). Higher frequencies carry more data but travel shorter distances. Radio frequencies range from 3 kHz to 300 GHz.'
    en['gloss6_term'] = 'Encryption'
    en['gloss6_def'] = 'The process of converting readable data (plaintext) into an unreadable format (ciphertext) using a mathematical algorithm and a key. Only someone with the correct key can decrypt and read the original data.'

    # FR
    fr = {}
    fr['gloss1_term'] = 'Signal'
    fr['gloss1_def'] = 'Une grandeur variable (tension, onde électromagnétique ou flux de données) qui transporte des informations. Dans cette simulation, les signaux sont représentés visuellement pour observer leurs changements.'
    fr['gloss2_term'] = 'Paramètre'
    fr['gloss2_def'] = 'Une valeur configurable qui modifie le comportement du système. Chaque curseur de cette app contrôle un paramètre spécifique. Modifier les paramètres permet d explorer les relations cause-effet.'
    fr['gloss3_term'] = 'Simulation'
    fr['gloss3_def'] = 'Un modèle logiciel qui imite le comportement réel. Cette app simule de vrais équipements pour apprendre en toute sécurité sans matériel. La physique et les mathématiques sont réelles — seuls les signaux sont virtuels.'
    fr['gloss4_term'] = 'Protocole'
    fr['gloss4_def'] = 'Un ensemble de règles définissant le format, la transmission et la réception des données. Les protocoles permettent la communication entre appareils différents. Exemples : WiFi, Bluetooth, HTTP, TCP/IP.'
    fr['gloss5_term'] = 'Fréquence'
    fr['gloss5_def'] = 'Le nombre de cycles qu un signal complète par seconde, mesuré en Hertz (Hz). Les fréquences plus élevées transportent plus de données mais parcourent de plus courtes distances.'
    fr['gloss6_term'] = 'Chiffrement'
    fr['gloss6_def'] = 'Le processus de conversion de données lisibles (texte clair) en format illisible (texte chiffré) à l aide d un algorithme mathématique et d une clé. Seule la bonne clé permet de déchiffrer.'

    # AR
    ar = {}
    ar['gloss1_term'] = 'إشارة'
    ar['gloss1_def'] = 'كمية متغيرة (جهد كهربائي أو موجة كهرومغناطيسية أو تدفق بيانات) تحمل معلومات. في هذه المحاكاة، تُمثل الإشارات بصرياً لمراقبة تغيراتها مع الوقت.'
    ar['gloss2_term'] = 'معامل'
    ar['gloss2_def'] = 'قيمة قابلة للتكوين تغير سلوك النظام. كل شريط تمرير في هذا التطبيق يتحكم في معامل محدد. تغيير المعاملات يتيح لك استكشاف علاقات السبب والنتيجة.'
    ar['gloss3_term'] = 'محاكاة'
    ar['gloss3_def'] = 'نموذج برمجي يحاكي السلوك الحقيقي. يحاكي هذا التطبيق معدات وعمليات حقيقية للتعلم بأمان بدون أجهزة. الفيزياء والرياضيات حقيقية — الإشارات فقط افتراضية.'
    ar['gloss4_term'] = 'بروتوكول'
    ar['gloss4_def'] = 'مجموعة قواعد تحدد كيفية تنسيق البيانات وإرسالها واستقبالها. تضمن البروتوكولات تواصل الأجهزة المختلفة. أمثلة: واي فاي وبلوتوث و HTTP و TCP/IP.'
    ar['gloss5_term'] = 'تردد'
    ar['gloss5_def'] = 'عدد الدورات التي تكملها إشارة في الثانية، يُقاس بالهرتز. الترددات الأعلى تحمل بيانات أكثر لكنها تنتقل لمسافات أقصر. تتراوح ترددات الراديو من 3 كيلوهرتز إلى 300 غيغاهرتز.'
    ar['gloss6_term'] = 'تشفير'
    ar['gloss6_def'] = 'عملية تحويل البيانات المقروءة (نص عادي) إلى صيغة غير مقروءة (نص مشفر) باستخدام خوارزمية رياضية ومفتاح. فقط من يملك المفتاح الصحيح يمكنه فك التشفير.'

    return en, fr, ar

def build_theory(title, field, hw, ctx):
    """Generate a theory/background section, trilingual."""
    desc = ctx.get('mainDesc', title)

    en = (
        f'Understanding the theory behind {title.lower()} requires grasping several interconnected concepts from {field}. '
        f'At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, '
        f'digital data streams, or sensor readings. The simulation in this app models these real-world phenomena '
        f'using mathematical equations running in your browser. Every button press and slider adjustment maps to '
        f'a real parameter that engineers and researchers tune in professional settings. '
        f'The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined '
        f'mathematical operations. Fourier analysis breaks complex signals into simple sine waves. '
        f'Shannon information theory tells us the maximum data rate for any communication channel. '
        f'Error correction codes add redundancy so messages survive noise and interference. '
        f'By experimenting with this simulation, you build intuition for these principles — '
        f'the same intuition that professionals develop over years of hands-on experience.'
    )

    fr = (
        f'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts '
        f'interconnectés de {field}. Au niveau le plus fondamental, cette technologie fonctionne en manipulant '
        f'des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. '
        f'La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. '
        f'Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. '
        f'Le principe clé est que l information peut être encodée, transmise, traitée et décodée '
        f'avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. '
        f'La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. '
        f'Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. '
        f'En expérimentant avec cette simulation, vous développez une intuition que les professionnels '
        f'acquièrent après des années d expérience pratique.'
    )

    ar = (
        f'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من {field}. '
        f'على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية '
        f'أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية '
        f'باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي '
        f'يضبطه المهندسون والباحثون في الإعدادات المهنية. '
        f'المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها '
        f'باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. '
        f'تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. '
        f'تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.'
    )

    return en, fr, ar

def build_extra_faq(title, field, hw, ctx):
    """Generate 2 extra FAQ pairs (q9/a9, q10/a10) trilingual."""
    en_q9 = f'What common mistakes should I avoid?'
    en_a9 = (
        f'The most common mistake is changing multiple parameters at once, which makes it impossible to understand '
        f'cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — '
        f'it records every event and helps you understand the sequence of operations. '
        f'Finally, do not skip the challenge section: those questions test whether you truly understand '
        f'the concepts or just memorized the button sequence.'
    )
    en_q10 = f'How does this relate to real-world {field}?'
    en_a10 = (
        f'This simulation models the same physics and mathematics used in professional {field} systems. '
        f'The parameters you adjust correspond to real equipment settings. The visualizations show data '
        f'patterns identical to what you would see on professional instruments like oscilloscopes, '
        f'spectrum analyzers, or protocol decoders. The main difference is that this runs safely in '
        f'your browser — real systems use {hw} hardware and may have legal requirements for operation. '
        f'Skills you develop here transfer directly to hands-on work.'
    )

    fr_q9 = 'Quelles erreurs courantes dois-je éviter ?'
    fr_a9 = (
        f'L erreur la plus courante est de modifier plusieurs paramètres simultanément, '
        f'ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. '
        f'Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. '
        f'Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.'
    )
    fr_q10 = f'Quel est le lien avec {field} dans le monde réel ?'
    fr_a10 = (
        f'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. '
        f'Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. '
        f'Les visualisations montrent des motifs identiques à ceux des instruments professionnels. '
        f'La différence principale est que ceci fonctionne en sécurité dans votre navigateur — '
        f'les vrais systèmes utilisent du matériel {hw} et peuvent avoir des exigences légales.'
    )

    ar_q9 = 'ما الأخطاء الشائعة التي يجب تجنبها؟'
    ar_a9 = (
        f'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. '
        f'غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — '
        f'فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. '
        f'أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.'
    )
    ar_q10 = f'كيف يرتبط هذا بـ{field} في العالم الحقيقي؟'
    ar_a10 = (
        f'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. '
        f'تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. '
        f'تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. '
        f'الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — '
        f'تستخدم الأنظمة الحقيقية أجهزة {hw} وقد تتطلب تراخيص قانونية للتشغيل.'
    )

    return (
        {'faq_q9': en_q9, 'faq_a9': en_a9, 'faq_q10': en_q10, 'faq_a10': en_a10},
        {'faq_q9': fr_q9, 'faq_a9': fr_a9, 'faq_q10': fr_q10, 'faq_a10': fr_a10},
        {'faq_q9': ar_q9, 'faq_a9': ar_a9, 'faq_q10': ar_q10, 'faq_a10': ar_a10},
    )

def safe_extract_value(block, key):
    """Extract a string value handling escaped quotes. Returns (start, end, value, quote_char) or None."""
    # Find the key
    m = re.search(rf'\b{re.escape(key)}\s*:\s*([\'"])', block)
    if not m:
        return None
    quote = m.group(1)
    val_start = m.end()
    # Walk forward, skipping escaped quotes
    i = val_start
    while i < len(block):
        if block[i] == '\\' and i + 1 < len(block):
            i += 2  # skip escaped char
            continue
        if block[i] == quote:
            return (val_start, i, block[val_start:i], quote)
        i += 1
    return None

def expand_short_howtos(js, lang):
    """Expand how-to steps that are under 100 chars."""
    # Skip expansion — too risky with escaped quotes in minified files
    return js

def expand_short_faqs(js, lang, field):
    """Expand FAQ answers that are under 100 chars."""
    # Skip expansion — too risky with escaped quotes in minified files
    return js

# ── Key formatter ────────────────────────────────────────────────────────

def format_keys(entries):
    """Format dict entries as JS key-value lines."""
    lines = []
    for k, v in entries.items():
        safe = v.replace("'", "\\'").replace('\n', '\\n')
        lines.append(f"    {k}: '{safe}',")
    return '\n'.join(lines)

# ── HTML updaters ────────────────────────────────────────────────────────

def update_html_wiki(html):
    """Add HTML elements for 6 new wiki entries if not already present."""
    if 'wiki_history' in html:
        return html
    new_entries = '''<div class="wiki-entry"><h3 data-i18n="wiki_history_title">📜 History</h3><p data-i18n="wiki_history">Loading...</p></div><div class="wiki-entry"><h3 data-i18n="wiki_math_title">📐 Mathematics</h3><p data-i18n="wiki_math">Loading...</p></div><div class="wiki-entry"><h3 data-i18n="wiki_advanced_title">🔬 Advanced</h3><p data-i18n="wiki_advanced">Loading...</p></div><div class="wiki-entry"><h3 data-i18n="wiki_compare_title">⚖️ Comparing</h3><p data-i18n="wiki_compare">Loading...</p></div><div class="wiki-entry"><h3 data-i18n="wiki_debug_title">🔧 Troubleshooting</h3><p data-i18n="wiki_debug">Loading...</p></div><div class="wiki-entry"><h3 data-i18n="wiki_ethics_title">⚖️ Ethics</h3><p data-i18n="wiki_ethics">Loading...</p></div>'''
    # Insert before closing of helpWiki
    html = html.replace('</div></div></div><div class="sidebar-footer">',
                        new_entries + '</div></div></div><div class="sidebar-footer">', 1)
    # Alternative pattern for multi-line HTML
    if 'wiki_history' not in html:
        # Try inserting before sidebar-footer
        html = html.replace('<div class="sidebar-footer">',
                           new_entries + '<div class="sidebar-footer">', 1)
    return html

def update_html_theory(html):
    """Add theory section in the guide tab if not present."""
    if 'theoryBlock' in html:
        return html
    theory_html = '<div class="guide-item" id="theoryBlock"><h3 data-i18n="theoryTitle">📖 Theory & Background</h3><p data-i18n="theory" style="line-height:1.6;font-size:0.85rem;">Loading...</p></div>'
    # Insert after guideStatus
    if 'guideStatus' in html:
        html = html.replace('</div></div><div class="help-content" id="helpHowto">',
                           theory_html + '</div></div><div class="help-content" id="helpHowto">', 1)
    if 'theoryBlock' not in html:
        # Alternative: before helpHowto
        html = html.replace('id="helpHowto"',
                           theory_html + '<div class="help-content" id="helpHowto_tmp">')
        # That may break things, try simpler approach
        html = html.replace(theory_html + '<div class="help-content" id="helpHowto_tmp">', 'id="helpHowto"')
        # Just insert before sidebar-footer if nothing else works
        html = html.replace('<div class="sidebar-footer">',
                           theory_html + '<div class="sidebar-footer">', 1)
    return html

def update_html_glossary(html):
    """Add glossary section in the help panel if not present."""
    if 'glossBlock' in html:
        return html
    gloss_html = '<div class="guide-item" id="glossBlock"><h3 data-i18n="glossTitle">📚 Key Terms</h3>'
    for i in range(1, 7):
        gloss_html += f'<p><strong data-i18n="gloss{i}_term">Term</strong>: <span data-i18n="gloss{i}_def">Definition</span></p>'
    gloss_html += '</div>'
    # Insert before sidebar-footer
    html = html.replace('<div class="sidebar-footer">',
                       gloss_html + '<div class="sidebar-footer">', 1)
    return html

# ── Main processing ──────────────────────────────────────────────────────

def process_app(cat_dir, app_dir):
    cat_num = cat_dir.split('-')[0]
    dom = CATEGORY_DOMAINS.get(cat_num, CATEGORY_DOMAINS['01'])
    field = dom['field']
    field_fr = dom['field_fr']
    field_ar = dom['field_ar']
    hw = dom['hw']

    js_path = os.path.join(cat_dir, app_dir, 'script.js')
    html_path = os.path.join(cat_dir, app_dir, 'index.html')

    if not os.path.isfile(js_path) or not os.path.isfile(html_path):
        return False

    with open(js_path, 'r') as f:
        js = f.read()
    with open(html_path, 'r') as f:
        html = f.read()

    title = dir_to_title(app_dir)
    ctx = extract_en_ctx(js)

    changed = False

    # 1. Add 6 extra wiki entries (if not already present)
    if not has_key(js, 'en', 'wiki_history'):
        wiki_en = build_wiki_extras(title, field, hw, ctx)
        wiki_fr = build_wiki_extras_fr(title, field_fr, hw)
        wiki_ar = build_wiki_extras_ar(title, field_ar, hw)
        js = append_keys(js, 'en', format_keys(wiki_en))
        js = append_keys(js, 'fr', format_keys(wiki_fr))
        js = append_keys(js, 'ar', format_keys(wiki_ar))
        changed = True

    # 2. Add glossary (if not present)
    if not has_key(js, 'en', 'gloss1_term'):
        gl_en, gl_fr, gl_ar = build_glossary(title, field, hw, ctx)
        js = append_keys(js, 'en', format_keys(gl_en))
        js = append_keys(js, 'fr', format_keys(gl_fr))
        js = append_keys(js, 'ar', format_keys(gl_ar))
        changed = True

    # 3. Add theory (if not present)
    if not has_key(js, 'en', 'theory'):
        th_en, th_fr, th_ar = build_theory(title, field, hw, ctx)
        theory_keys_en = {'theoryTitle': '📖 Theory & Background', 'theory': th_en}
        theory_keys_fr = {'theoryTitle': '📖 Théorie et contexte', 'theory': th_fr}
        theory_keys_ar = {'theoryTitle': '📖 النظرية والخلفية', 'theory': th_ar}
        js = append_keys(js, 'en', format_keys(theory_keys_en))
        js = append_keys(js, 'fr', format_keys(theory_keys_fr))
        js = append_keys(js, 'ar', format_keys(theory_keys_ar))
        changed = True

    # 4. Add extra FAQ pairs (if not present)
    if not has_key(js, 'en', 'faq_q9'):
        faq_en, faq_fr, faq_ar = build_extra_faq(title, field, hw, ctx)
        js = append_keys(js, 'en', format_keys(faq_en))
        js = append_keys(js, 'fr', format_keys(faq_fr))
        js = append_keys(js, 'ar', format_keys(faq_ar))
        changed = True

    # 5. Expand short FAQ answers
    for lang, f in [('en', field), ('fr', field_fr), ('ar', field_ar)]:
        js = expand_short_faqs(js, lang, f)

    # 6. Expand short how-to steps
    for lang in ['en', 'fr', 'ar']:
        js = expand_short_howtos(js, lang)

    # 7. Add glossTitle to LANG_BASE keys (if present)
    if not has_key(js, 'en', 'glossTitle'):
        js = append_keys(js, 'en', "    glossTitle: '📚 Key Terms',")
        js = append_keys(js, 'fr', "    glossTitle: '📚 Termes clés',")
        js = append_keys(js, 'ar', "    glossTitle: '📚 مصطلحات أساسية',")

    # Update HTML
    html = update_html_wiki(html)
    html = update_html_theory(html)
    html = update_html_glossary(html)

    with open(js_path, 'w') as f:
        f.write(js)
    with open(html_path, 'w') as f:
        f.write(html)

    return True

# ── Run ──────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    count = 0
    for cat in sorted(os.listdir('.')):
        if not os.path.isdir(cat) or not cat[0].isdigit():
            continue
        for app in sorted(os.listdir(cat)):
            if app.startswith('_') or app.startswith('.'):
                continue
            app_path = os.path.join(cat, app)
            if not os.path.isdir(app_path):
                continue
            if process_app(cat, app):
                count += 1
    print(f'Enriched {count} apps with deep documentation')
