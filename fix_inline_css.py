#!/usr/bin/env python3
"""Phase 8: Remove duplicate inline CSS from index.html files.

Many apps have a full copy of the 1,205-line template CSS inside a <style> block
AND a <link> to style.css. This removes the bloated inline CSS, keeping only
app-specific styles and the external stylesheet link.
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

# Read template CSS to identify duplicate content
TEMPLATE_CSS_PATH = os.path.join(ROOT, '..', 'tools', 'web_app_template', 'style.css')
if os.path.exists(TEMPLATE_CSS_PATH):
    with open(TEMPLATE_CSS_PATH, 'r', encoding='utf-8') as f:
        TEMPLATE_CSS = f.read()
    TEMPLATE_SIZE = len(TEMPLATE_CSS)
else:
    TEMPLATE_SIZE = 30000  # approximate

# Key CSS selectors from template that indicate full duplicate
TEMPLATE_MARKERS = [
    '.matrix-canvas',
    '.sidebar-overlay',
    '.collapsible',
    '.app-footer',
    '.deco-band',
    '.splash',
    '.log-filters',
    '.toast-indicator',
]

fixed = 0
bytes_saved = 0

for html_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'index.html'))):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check if it has both inline <style> and external <link>
    has_link = 'href="style.css"' in html
    if not has_link:
        continue

    # Find all <style> blocks
    style_blocks = list(re.finditer(r'<style>(.*?)</style>', html, re.DOTALL))
    if not style_blocks:
        continue

    new_html = html
    removed = 0

    for block in reversed(style_blocks):  # reverse to maintain positions
        css_content = block.group(1)

        # Check if this is a large duplicate of template CSS
        is_template_dup = len(css_content) > 5000 and sum(1 for m in TEMPLATE_MARKERS if m in css_content) >= 5

        if is_template_dup:
            # Extract any app-specific CSS (custom classes not in template)
            # Keep: .agent-card, .step-grid, .step-card, .code-tab, .demo-*, .learn-*
            app_specific = []
            lines = css_content.split('\n')
            in_custom = False
            custom_block = []
            brace_depth = 0

            for line in lines:
                stripped = line.strip()

                # Check if this is an app-specific selector
                is_custom = False
                custom_selectors = [
                    '.agent-card', '.verify-stamp', '.id-badge', '.hud-',
                    '.threat-', '.circuit-', '.radar-', '.signal-',
                    '#', '@keyframes stamp', '@keyframes pulse',
                    '@keyframes glow', '@keyframes scan',
                ]
                for sel in custom_selectors:
                    if stripped.startswith(sel) or (stripped.startswith('.') and sel in stripped):
                        is_custom = True
                        break

                # Also keep step-card, code-tab, demo, learn CSS (we added these)
                for added_sel in ['.step-grid', '.step-card', '.code-tab', '.code-display',
                                  '.demo-', '.learn-', '.demo-highlight']:
                    if added_sel in stripped:
                        is_custom = True
                        break

                if is_custom or in_custom:
                    if not in_custom:
                        in_custom = True
                        custom_block = [line]
                        brace_depth = line.count('{') - line.count('}')
                    else:
                        custom_block.append(line)
                        brace_depth += line.count('{') - line.count('}')
                        if brace_depth <= 0:
                            app_specific.extend(custom_block)
                            custom_block = []
                            in_custom = False
                            brace_depth = 0

            # Replace the style block with only app-specific CSS
            if app_specific:
                new_css = '\n'.join(app_specific)
                new_style = f'<style>\n{new_css}\n  </style>'
            else:
                new_style = ''

            old_len = len(block.group(0))
            new_len = len(new_style)
            bytes_saved += old_len - new_len
            removed += 1

            new_html = new_html[:block.start()] + new_style + new_html[block.end():]

    if removed > 0:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        fixed += 1

print(f"✓ Cleaned inline CSS from {fixed} apps")
print(f"  Saved ~{bytes_saved // 1024} KB total")
