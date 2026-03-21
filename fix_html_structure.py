#!/usr/bin/env python3
"""
Fix HTML structure in all 488 apps:
1. Move wiki extra entries (history, math, etc.) inside helpWiki div
2. Move glossary inside helpWiki div
3. Fix theory block nesting in guide tab
4. Fix wiki/kids tab button nesting
5. Ensure all content is inside proper tab containers
"""
import os, re

def fix_html(html):
    changed = False

    # ── Fix 1: Wiki/Kids tab button nesting ──
    # Bad: <button data-tab="wiki"><button data-tab="kids"...>Kids</button>Wiki</button>
    # Good: <button data-tab="wiki">Wiki</button><button data-tab="kids"...>Kids</button>
    bad_btn = '<button class="help-tab" data-tab="wiki"><button class="help-tab" data-tab="kids" data-i18n="kidTitle">Kids</button>Wiki</button>'
    good_btn = '<button class="help-tab" data-tab="wiki">Wiki</button><button class="help-tab" data-tab="kids" data-i18n="kidTitle">Kids</button>'
    if bad_btn in html:
        html = html.replace(bad_btn, good_btn)
        changed = True

    # ── Fix 2: Remove wiki extra entries from wrong location ──
    # These 6 entries were inserted before sidebar-footer but outside helpWiki
    wiki_extra_html = (
        '<div class="wiki-entry"><h3 data-i18n="wiki_history_title">📜 History</h3><p data-i18n="wiki_history">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_math_title">📐 Mathematics</h3><p data-i18n="wiki_math">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_advanced_title">🔬 Advanced</h3><p data-i18n="wiki_advanced">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_compare_title">⚖️ Comparing</h3><p data-i18n="wiki_compare">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_debug_title">🔧 Troubleshooting</h3><p data-i18n="wiki_debug">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_ethics_title">⚖️ Ethics</h3><p data-i18n="wiki_ethics">Loading...</p></div>'
    )

    # Remove from wrong location (outside helpWiki, before sidebar-footer or glossBlock)
    if wiki_extra_html in html:
        html = html.replace(wiki_extra_html, '')
        changed = True

    # ── Fix 3: Remove glossary from wrong location ──
    gloss_html = (
        '<div class="guide-item" id="glossBlock"><h3 data-i18n="glossTitle">📚 Key Terms</h3>'
        '<p><strong data-i18n="gloss1_term">Term</strong>: <span data-i18n="gloss1_def">Definition</span></p>'
        '<p><strong data-i18n="gloss2_term">Term</strong>: <span data-i18n="gloss2_def">Definition</span></p>'
        '<p><strong data-i18n="gloss3_term">Term</strong>: <span data-i18n="gloss3_def">Definition</span></p>'
        '<p><strong data-i18n="gloss4_term">Term</strong>: <span data-i18n="gloss4_def">Definition</span></p>'
        '<p><strong data-i18n="gloss5_term">Term</strong>: <span data-i18n="gloss5_def">Definition</span></p>'
        '<p><strong data-i18n="gloss6_term">Term</strong>: <span data-i18n="gloss6_def">Definition</span></p>'
        '</div>'
    )
    if gloss_html in html:
        html = html.replace(gloss_html, '')
        changed = True

    # ── Fix 4: Remove theory from wrong location (nested in guideStatus) ──
    theory_html = '<div class="guide-item" id="theoryBlock"><h3 data-i18n="theoryTitle">📖 Theory & Background</h3><p data-i18n="theory" style="line-height:1.6;font-size:0.85rem;">Loading...</p></div>'

    # It may be inside a guide-item div (bad nesting)
    # Pattern: guideStatus content</p><div theory>...</div></div>
    bad_theory = '</p>' + theory_html + '</div></div>'
    good_no_theory = '</p></div></div>'
    if bad_theory in html:
        html = html.replace(bad_theory, good_no_theory)
        changed = True

    # Also remove standalone theory if it's outside guide
    if theory_html in html:
        html = html.replace(theory_html, '')
        changed = True

    # ── Fix 5: Insert everything in the correct locations ──

    # 5a. Insert wiki extras INSIDE helpWiki div (before its closing)
    # The helpWiki div has existing wiki entries followed by an empty <div class="wiki-entry">
    # We want to add our extras before that empty div
    wiki_insert = (
        '<div class="wiki-entry"><h3 data-i18n="wiki_history_title">📜 History</h3>'
        '<p data-i18n="wiki_history">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_math_title">📐 Mathematics</h3>'
        '<p data-i18n="wiki_math">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_advanced_title">🔬 Advanced</h3>'
        '<p data-i18n="wiki_advanced">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_compare_title">⚖️ Comparing</h3>'
        '<p data-i18n="wiki_compare">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_debug_title">🔧 Troubleshooting</h3>'
        '<p data-i18n="wiki_debug">Loading...</p></div>'
        '<div class="wiki-entry"><h3 data-i18n="wiki_ethics_title">⚖️ Ethics</h3>'
        '<p data-i18n="wiki_ethics">Loading...</p></div>'
    )

    # Check if wiki extras already in correct location (inside helpWiki)
    if 'wiki_history_title' not in html:
        # Find the last wiki entry div inside helpWiki
        # Pattern: empty wiki entry div followed by helpWiki closing
        empty_wiki = '<div class="wiki-entry">\n        </div></div>'
        if empty_wiki in html:
            html = html.replace(empty_wiki, wiki_insert + '</div></div>')
            changed = True
        else:
            # Try alternative: insert before helpWiki closing
            # helpWiki closes with </div></div> before helpKids or sidebar-footer
            wiki_close = '</div></div><div class="help-content" id="helpKids">'
            if wiki_close in html:
                html = html.replace(wiki_close, wiki_insert + '</div></div><div class="help-content" id="helpKids">')
                changed = True

    # 5b. Insert glossary INSIDE helpWiki (after wiki entries)
    gloss_insert = (
        '<div class="wiki-entry" id="glossBlock"><h3 data-i18n="glossTitle">📚 Key Terms</h3>'
        '<p><strong data-i18n="gloss1_term">Term</strong>: <span data-i18n="gloss1_def">Definition</span></p>'
        '<p><strong data-i18n="gloss2_term">Term</strong>: <span data-i18n="gloss2_def">Definition</span></p>'
        '<p><strong data-i18n="gloss3_term">Term</strong>: <span data-i18n="gloss3_def">Definition</span></p>'
        '<p><strong data-i18n="gloss4_term">Term</strong>: <span data-i18n="gloss4_def">Definition</span></p>'
        '<p><strong data-i18n="gloss5_term">Term</strong>: <span data-i18n="gloss5_def">Definition</span></p>'
        '<p><strong data-i18n="gloss6_term">Term</strong>: <span data-i18n="gloss6_def">Definition</span></p>'
        '</div>'
    )

    if 'glossBlock' not in html:
        # Insert before helpWiki closing
        wiki_close_before_kids = '</div></div><div class="help-content" id="helpKids">'
        if wiki_close_before_kids in html:
            html = html.replace(wiki_close_before_kids, gloss_insert + '</div></div><div class="help-content" id="helpKids">')
            changed = True

    # 5c. Insert theory INSIDE helpGuide (after guideStatus, properly nested)
    theory_insert = (
        '<div class="guide-item" id="theoryBlock">'
        '<h3 data-i18n="theoryTitle">📖 Theory & Background</h3>'
        '<p data-i18n="theory" style="line-height:1.6;font-size:0.85rem;">Loading...</p>'
        '</div>'
    )

    if 'theoryBlock' not in html:
        # Insert after the last guide-item (guideStatus) inside helpGuide
        guide_close = '</div></div><div class="help-content" id="helpHowto">'
        if guide_close in html:
            html = html.replace(guide_close, theory_insert + '</div></div><div class="help-content" id="helpHowto">')
            changed = True

    return html, changed


# ── Run ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    count = 0
    for cat in sorted(os.listdir('.')):
        if not os.path.isdir(cat) or not cat[0].isdigit():
            continue
        for app in sorted(os.listdir(cat)):
            html_path = os.path.join(cat, app, 'index.html')
            if not os.path.isfile(html_path):
                continue
            with open(html_path) as f:
                html = f.read()
            new_html, changed = fix_html(html)
            if changed:
                with open(html_path, 'w') as f:
                    f.write(new_html)
                count += 1
    print(f'Fixed HTML structure in {count} apps')
