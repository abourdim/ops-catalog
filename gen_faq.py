#!/usr/bin/env python3
"""Phase 3: Replace FAQ with 8 kid-friendly Q&A pairs per app.

Replaces existing 4 generic FAQ items with 8 age-appropriate (10-16) Q&A pairs.
Each app gets domain-specific content with fun tone, analogies, and emojis.
"""

import os
import re
import glob
import random

ROOT = os.path.dirname(os.path.abspath(__file__))

# ═══════════════════════════════════════════════════════
# Domain-specific FAQ templates
# ═══════════════════════════════════════════════════════

# Each domain has 8 Q&A pairs: Q1-Q2 are intro, Q3 activity, Q4 science,
# Q5 challenge, Q6 hardware, Q7 safety, Q8 next steps

def get_domain(cat_dir):
    prefix = cat_dir.split('-')[0]
    domain_map = {
        '01': 'spy', '02': 'spy', '03': 'spy', '04': 'spy',
        '05': 'net', '06': 'net', '07': 'net', '08': 'net', '09': 'net',
        '10': 'hrf', '11': 'hrf', '12': 'hrf', '13': 'hrf',
        '14': 'wifi', '15': 'wifi', '16': 'wifi', '17': 'wifi', '18': 'wifi',
        '19': 'ham', '20': 'ham', '21': 'ham', '22': 'ham', '23': 'ham',
        '24': 'ham', '25': 'ham', '26': 'ham',
        '27': 'sdr', '28': 'sdr', '29': 'sdr', '30': 'sdr',
        '31': 'sdr', '32': 'sdr', '33': 'sdr', '34': 'sdr',
        '35': 'ant', '36': 'pi', '37': 'pi', '38': 'pi',
        '39': 'agent', '40': 'agent', '41': 'ant', '42': 'agent',
        '43': 'bio', '44': 'sonic', '45': 'chrono', '46': 'swarm',
        '47': 'phys', '48': 'dark', '49': 'ai', '50': 'civ',
        '51': 'se', '52': 'imp', '53': 'cry', '54': 'rfw', '55': 'esc',
    }
    return domain_map.get(prefix, 'spy')


def get_hw_label(cat_dir):
    prefix = cat_dir.split('-')[0]
    hw_map = {
        '01': 'BBC micro:bit V2', '07': 'BBC micro:bit V2', '11': 'BBC micro:bit V2',
        '22': 'BBC micro:bit V2', '40': 'BBC micro:bit V2',
        '02': 'ESP32', '05': 'ESP32', '12': 'ESP32', '18': 'ESP32', '23': 'ESP32',
        '10': 'RTL-SDR or HackRF', '16': 'HackRF One',
        '27': 'RTL-SDR', '28': 'RTL-SDR', '29': 'RTL-SDR', '30': 'RTL-SDR',
        '31': 'RTL-SDR', '32': 'RTL-SDR', '33': 'RTL-SDR', '34': 'RTL-SDR',
        '36': 'Raspberry Pi', '37': 'Raspberry Pi', '38': 'Raspberry Pi',
    }
    return hw_map.get(prefix, 'a computer with Python 3')


def get_sibling_apps(app_dir):
    """Get 2 sibling app names from the same category."""
    cat_dir = os.path.dirname(app_dir)
    current = os.path.basename(app_dir)
    siblings = []
    for d in sorted(os.listdir(cat_dir)):
        if d != current and os.path.isdir(os.path.join(cat_dir, d)):
            siblings.append(d)
    random.shuffle(siblings)
    return siblings[:2]


def get_app_title(script_content):
    m = re.search(r"title\s*:\s*'([^']*)'", script_content)
    return m.group(1) if m else 'this app'


# ═══════════════════════════════════════════════════════
# FAQ content by domain (EN/FR/AR)
# ═══════════════════════════════════════════════════════

DOMAIN_FAQ = {
    'spy': {
        'en': [
            ("What does this app do?", "It's like a spy gadget simulator! 🕵️ You get to play with real encryption, secret messages, and covert communication — the same tech real spies use."),
            ("How does it work?", "The simulation runs right in your browser. It shows you step by step how secret agents protect their messages using math and radio signals."),
            ("What should I try first?", "Hit the main button and watch what happens! 🎯 Then try changing the settings to see how it affects the results."),
            ("What's the real science?", "This uses real cryptography — the same math that protects your WhatsApp messages and bank passwords! 🔐"),
            ("Can I break it?", "Try the Lab section! See if you can crack the code or intercept the message. That's how real security researchers think! 💪"),
            ("What hardware do I need?", "For the real version, check the 📦 Device Code section. You can flash it to actual hardware!"),
            ("Is it safe to use?", "100% safe! 🛡️ Everything runs locally in your browser. No internet needed, no data leaves your device."),
            ("What should I try next?", "Explore other spy apps in this category! Each one teaches a different secret agent technique."),
        ],
        'fr': [
            ("Que fait cette appli ?", "C'est comme un simulateur de gadget d'espion ! 🕵️ Tu peux jouer avec du vrai chiffrement et des messages secrets."),
            ("Comment ça marche ?", "La simulation tourne dans ton navigateur. Elle te montre étape par étape comment les agents secrets protègent leurs messages."),
            ("Que dois-je essayer d'abord ?", "Clique sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l'effet."),
            ("C'est quoi la vraie science ?", "Ça utilise de la vraie cryptographie — les mêmes maths qui protègent tes messages WhatsApp ! 🔐"),
            ("Je peux le casser ?", "Essaie la section Labo ! Vois si tu peux craquer le code. C'est comme ça que pensent les vrais chercheurs ! 💪"),
            ("Quel matériel me faut-il ?", "Pour la vraie version, regarde la section 📦 Code Appareil. Tu peux le flasher sur du vrai matériel !"),
            ("C'est sûr ?", "100% sûr ! 🛡️ Tout tourne localement dans ton navigateur. Pas besoin d'internet."),
            ("Que faire ensuite ?", "Explore les autres applis d'espionnage dans cette catégorie ! Chacune enseigne une technique différente."),
        ],
        'ar': [
            ("ماذا يفعل هذا التطبيق؟", "إنه مثل محاكي أدوات التجسس! 🕵️ يمكنك اللعب بتشفير حقيقي ورسائل سرية."),
            ("كيف يعمل؟", "المحاكاة تعمل في متصفحك. تُظهر لك خطوة بخطوة كيف يحمي العملاء السريون رسائلهم."),
            ("ماذا أجرب أولاً؟", "اضغط على الزر الرئيسي وشاهد! 🎯 ثم غيّر الإعدادات لترى التأثير."),
            ("ما العلم الحقيقي؟", "يستخدم تشفيراً حقيقياً — نفس الرياضيات التي تحمي رسائل WhatsApp! 🔐"),
            ("هل يمكنني كسره؟", "جرب قسم المختبر! حاول كسر الشيفرة. هكذا يفكر الباحثون الأمنيون! 💪"),
            ("ما العتاد المطلوب؟", "للنسخة الحقيقية، تفقد قسم 📦 كود الجهاز!"),
            ("هل هو آمن؟", "آمن 100%! 🛡️ كل شيء يعمل محلياً في متصفحك. لا حاجة للإنترنت."),
            ("ماذا أجرب بعد ذلك؟", "استكشف تطبيقات التجسس الأخرى! كل واحد يعلّم تقنية مختلفة."),
        ],
    },
    'net': {
        'en': [
            ("What does this app do?", "It lets you see how computer networks talk to each other! 🌐 Like X-ray vision for internet traffic."),
            ("How does it work?", "The simulation shows real network protocols — the rules that computers follow to send data across the internet."),
            ("What should I try first?", "Start a scan and watch the packets fly! 📡 Each colored packet is a different type of network message."),
            ("What's the real science?", "This is how the entire internet works! TCP/IP, DNS, ARP — these protocols power every website you visit. 🌍"),
            ("Can I break it?", "Try the Lab section! See what happens when you inject bad packets or flood the network. That's network security! 🛡️"),
            ("What hardware do I need?", "For the real version, check 📦 Device Code. An ESP32 or Raspberry Pi can do real network scanning!"),
            ("Is it safe to use?", "Totally safe! 🛡️ This is a simulation — no real network traffic. Everything stays in your browser."),
            ("What should I try next?", "Try other networking apps! Learn about different protocols and how they keep the internet running."),
        ],
        'fr': [
            ("Que fait cette appli ?", "Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet."),
            ("Comment ça marche ?", "La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données."),
            ("Que dois-je essayer ?", "Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent."),
            ("C'est quoi la vraie science ?", "C'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍"),
            ("Je peux le casser ?", "Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C'est la sécurité réseau ! 🛡️"),
            ("Quel matériel ?", "Regarde 📦 Code Appareil. Un ESP32 ou Raspberry Pi peut faire du vrai scan réseau !"),
            ("C'est sûr ?", "Totalement sûr ! 🛡️ C'est une simulation — pas de vrai trafic réseau."),
            ("Que faire ensuite ?", "Essaie d'autres applis réseau ! Apprends différents protocoles."),
        ],
        'ar': [
            ("ماذا يفعل هذا التطبيق؟", "يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت."),
            ("كيف يعمل؟", "المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات."),
            ("ماذا أجرب أولاً؟", "ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل."),
            ("ما العلم الحقيقي؟", "هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍"),
            ("هل يمكنني كسره؟", "جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️"),
            ("ما العتاد المطلوب؟", "تفقد 📦 كود الجهاز. ESP32 أو Raspberry Pi يمكنه المسح الحقيقي!"),
            ("هل هو آمن؟", "آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية."),
            ("ماذا بعد؟", "جرب تطبيقات الشبكات الأخرى! تعلم بروتوكولات مختلفة."),
        ],
    },
}

# Generate remaining domains using a common pattern
COMMON_DOMAINS = {
    'wifi': ('WiFi', 'WiFi signals', 'wireless networks', 'WiFi adapter'),
    'ham': ('ham radio', 'radio signals', 'amateur radio communication', 'SDR or radio transceiver'),
    'sdr': ('software-defined radio', 'radio signals', 'digital signal processing', 'RTL-SDR dongle'),
    'hrf': ('RF signals', 'radio frequency patterns', 'signal intelligence', 'RTL-SDR or HackRF'),
    'ant': ('antennas', 'radio wave patterns', 'antenna design and physics', 'wire and connectors'),
    'pi': ('Raspberry Pi projects', 'sensors and GPIO', 'physical computing', 'Raspberry Pi'),
    'agent': ('field agent gear', 'covert tech', 'tactical communication', 'micro:bit or ESP32'),
    'bio': ('bio-signals', 'body signals into radio', 'biometric radio technology', 'biosensors'),
    'sonic': ('acoustic warfare', 'sound waves', 'acoustic science and attacks', 'speakers and microphones'),
    'chrono': ('time manipulation', 'timing and synchronization', 'temporal attacks and precision clocks', 'a precise clock source'),
    'swarm': ('swarm intelligence', 'collective behavior', 'emergent algorithms and self-organization', 'multiple networked devices'),
    'phys': ('impossible physics', 'exotic physical phenomena', 'cutting-edge physics simulations', 'lab sensors'),
    'dark': ('security testing', 'attack and defense techniques', 'cybersecurity offense and defense', 'specialized hardware'),
    'ai': ('AI-powered radio', 'machine learning for signals', 'neural networks and radio', 'GPU or SDR'),
    'civ': ('civilization monitoring', 'environmental sensors', 'disaster detection and response', 'sensor stations'),
    'se': ('social engineering', 'human psychology in security', 'social manipulation awareness', 'just a browser'),
    'imp': ('hardware implants', 'covert hardware devices', 'physical security and implant design', 'microcontrollers'),
    'cry': ('cryptographic attacks', 'breaking encryption', 'mathematical attacks on ciphers', 'a fast computer'),
    'rfw': ('RF warfare', 'electronic warfare signals', 'electromagnetic combat techniques', 'SDR or signal generator'),
    'esc': ('escape and evasion', 'anti-surveillance techniques', 'counter-surveillance and privacy', 'various tools'),
}

for domain_key, (topic, what_it_shows, science_desc, hw_needed) in COMMON_DOMAINS.items():
    if domain_key in DOMAIN_FAQ:
        continue
    DOMAIN_FAQ[domain_key] = {
        'en': [
            (f"What does this app do?", f"It simulates {topic}! 🔬 You get to experiment with {what_it_shows} in a safe sandbox."),
            ("How does it work?", f"The simulation runs in your browser. It models real {what_it_shows} so you can see what happens step by step."),
            ("What should I try first?", f"Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results."),
            ("What's the real science?", f"This is real {science_desc}! The same principles are used by professionals in the field. 🧪"),
            ("Can I break it?", "Try the Lab section! Push the parameters to extremes and see what happens. That's how scientists discover new things! 💡"),
            (f"What hardware do I need?", f"For the real version you'll need {hw_needed}. Check 📦 Device Code for ready-to-flash firmware!"),
            ("Is it safe to use?", "Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device."),
            ("What should I try next?", "Explore the other apps in this category! Each one teaches a different aspect of the technology."),
        ],
        'fr': [
            (f"Que fait cette appli ?", f"Elle simule {topic} ! 🔬 Tu peux expérimenter avec {what_it_shows} en toute sécurité."),
            ("Comment ça marche ?", f"La simulation tourne dans ton navigateur. Elle modélise de vrais {what_it_shows}."),
            ("Que dois-je essayer ?", f"Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l'effet."),
            ("C'est quoi la vraie science ?", f"C'est du vrai {science_desc} ! Les mêmes principes utilisés par les professionnels. 🧪"),
            ("Je peux le casser ?", "Essaie le Labo ! Pousse les paramètres à l'extrême et observe. C'est comme ça qu'on découvre ! 💡"),
            (f"Quel matériel ?", f"Pour la version réelle, il te faut {hw_needed}. Regarde 📦 Code Appareil !"),
            ("C'est sûr ?", "Absolument sûr ! 🛡️ Tout tourne localement. Pas d'internet requis."),
            ("Que faire ensuite ?", "Explore les autres applis de cette catégorie ! Chacune enseigne un aspect différent."),
        ],
        'ar': [
            (f"ماذا يفعل هذا التطبيق؟", f"يحاكي {topic}! 🔬 يمكنك التجربة مع {what_it_shows} في بيئة آمنة."),
            ("كيف يعمل؟", f"المحاكاة تعمل في متصفحك. تنمذج {what_it_shows} حقيقية خطوة بخطوة."),
            ("ماذا أجرب أولاً؟", f"اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير."),
            ("ما العلم الحقيقي؟", f"هذا {science_desc} حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪"),
            ("هل يمكنني كسره؟", "جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡"),
            (f"ما العتاد المطلوب؟", f"للنسخة الحقيقية تحتاج {hw_needed}. تفقد 📦 كود الجهاز!"),
            ("هل هو آمن؟", "آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت."),
            ("ماذا بعد؟", "استكشف التطبيقات الأخرى في هذه الفئة! كل واحد يعلّم جانباً مختلفاً."),
        ],
    }


def generate_faq_html(faq_en):
    """Generate 8 FAQ HTML items."""
    items = []
    for i, (q, a) in enumerate(faq_en, 1):
        items.append(f'        <details class="help-item"><summary data-i18n="faq_q{i}">{q}</summary><p data-i18n="faq_a{i}">{a}</p></details>')
    return '\n'.join(items)


def generate_faq_i18n(faq_pairs, lang):
    """Generate FAQ i18n key-value strings."""
    parts = []
    for i, (q, a) in enumerate(faq_pairs, 1):
        q_esc = q.replace("'", "\\'")
        a_esc = a.replace("'", "\\'")
        parts.append(f"faq_q{i}:'{q_esc}',faq_a{i}:'{a_esc}'")
    return ','.join(parts)


def replace_faq_in_html(html_content, new_faq_html):
    """Replace existing FAQ items in HTML with new 8-item FAQ."""
    # Find the FAQ section: look for consecutive faq_q items
    # Pattern: one or more <details class="help-item"> with faq_q data-i18n
    first_faq = re.search(r'<details class="help-item"><summary data-i18n="faq_q1">', html_content)
    if not first_faq:
        return html_content, False

    start = first_faq.start()

    # Find the last faq item
    last_faq = None
    for m in re.finditer(r'<details class="help-item"><summary data-i18n="faq_q\d+">[^<]*</summary><p data-i18n="faq_a\d+">[^<]*</p></details>', html_content):
        last_faq = m

    if not last_faq:
        return html_content, False

    end = last_faq.end()

    html_content = html_content[:start] + new_faq_html + html_content[end:]
    return html_content, True


def replace_faq_in_script(script_content, faq_en, faq_fr, faq_ar):
    """Replace FAQ i18n keys in script.js."""
    new_content = script_content

    for lang, faq_pairs in [('en', faq_en), ('fr', faq_fr), ('ar', faq_ar)]:
        # Find the language block
        lang_start = re.search(rf'\b{lang}\s*:\s*\{{', new_content)
        if not lang_start:
            continue

        start = lang_start.end()
        depth = 1
        pos = start
        while pos < len(new_content) and depth > 0:
            if new_content[pos] == '{':
                depth += 1
            elif new_content[pos] == '}':
                depth -= 1
            pos += 1
        block_end = pos
        block_start = lang_start.start()

        block = new_content[block_start:block_end]

        # Remove all existing faq_q/faq_a keys (1-8)
        for i in range(1, 9):
            block = re.sub(rf",?\s*faq_q{i}\s*:\s*'(?:[^'\\]|\\.)*'", '', block)
            block = re.sub(rf",?\s*faq_a{i}\s*:\s*'(?:[^'\\]|\\.)*'", '', block)

        # Clean up any double commas
        block = re.sub(r',\s*,', ',', block)
        block = re.sub(r'\{,', '{', block)

        # Find closing brace and insert new FAQ keys
        close_brace = block.rfind('}')
        if close_brace > 0:
            faq_str = generate_faq_i18n(faq_pairs, lang)
            block = block[:close_brace] + ',' + faq_str + block[close_brace:]

        new_content = new_content[:block_start] + block + new_content[block_end:]

    return new_content


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

fixed = 0

for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    app_dir = os.path.dirname(script_path)
    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))
    domain = get_domain(cat_name)

    with open(script_path, 'r', encoding='utf-8') as f:
        script_content = f.read()

    # Skip if already has 8 FAQ items
    if 'faq_q8' in script_content:
        continue

    title = get_app_title(script_content)
    hw = get_hw_label(cat_name)
    siblings = get_sibling_apps(app_dir)

    # Get domain FAQ template
    faq_data = DOMAIN_FAQ.get(domain, DOMAIN_FAQ['spy'])
    faq_en = list(faq_data['en'])
    faq_fr = list(faq_data['fr'])
    faq_ar = list(faq_data['ar'])

    # Customize Q1 with app title
    faq_en[0] = (faq_en[0][0], faq_en[0][1].replace('this app', title))
    faq_fr[0] = (faq_fr[0][0], faq_fr[0][1])
    faq_ar[0] = (faq_ar[0][0], faq_ar[0][1])

    # Customize Q6 with hardware
    faq_en[5] = (faq_en[5][0], f"For the real version, you'll need {hw}. Check the 📦 Device Code section for ready-to-use firmware!")
    faq_fr[5] = (faq_fr[5][0], f"Pour la version réelle, il te faut {hw}. Regarde 📦 Code Appareil !")
    faq_ar[5] = (faq_ar[5][0], f"للنسخة الحقيقية تحتاج {hw}. تفقد 📦 كود الجهاز!")

    # Customize Q8 with sibling apps
    if siblings:
        sib_names = ' and '.join([s.replace('-', ' ').title() for s in siblings[:2]])
        faq_en[7] = (faq_en[7][0], f"Try {sib_names}! Each teaches something different. 🚀")
        faq_fr[7] = (faq_fr[7][0], f"Essaie {sib_names} ! Chacune enseigne quelque chose de différent. 🚀")
        faq_ar[7] = (faq_ar[7][0], f"جرب {sib_names}! كل واحد يعلّم شيئاً مختلفاً. 🚀")

    # ── Fix HTML ──
    html_path = os.path.join(app_dir, 'index.html')
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        new_faq_html = generate_faq_html(faq_en)
        html_content, html_ok = replace_faq_in_html(html_content, new_faq_html)

        if html_ok:
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)

    # ── Fix script.js ──
    new_script = replace_faq_in_script(script_content, faq_en, faq_fr, faq_ar)

    if new_script != script_content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_script)

    fixed += 1
    if fixed % 50 == 0:
        print(f"  ... processed {fixed} apps")

print(f"\n✓ Updated FAQ to 8 items in {fixed} apps")
