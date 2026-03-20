#!/usr/bin/env python3
"""Phase 7: Generate PWA icons (icon-192.png and icon-512.png) for all apps.

Creates simple text-based icons using Pillow with app initials on dark background.
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False


def get_initials(app_name):
    """Get 2-letter initials from app name."""
    parts = app_name.replace('-', ' ').split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[1][0]).upper()
    return app_name[:2].upper()


def create_icon(size, initials, output_path):
    """Create a simple icon with initials."""
    bg_color = (8, 9, 26)  # #08091a
    accent_color = (200, 170, 100)  # gold accent

    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)

    # Draw a subtle circle
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin],
                 outline=accent_color, width=max(2, size // 64))

    # Draw initials
    font_size = size // 3
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except (OSError, IOError):
        try:
            font = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", font_size)
        except (OSError, IOError):
            font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), initials, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2
    y = (size - text_h) // 2 - bbox[1]

    draw.text((x, y), initials, fill=accent_color, font=font)

    img.save(output_path, 'PNG')


created = 0

if not HAS_PILLOW:
    print("⚠ Pillow not installed. Creating placeholder icons with pure Python.")
    print("  Install Pillow for better icons: pip install Pillow")

    # Create minimal valid PNG files as placeholders
    import struct
    import zlib

    def create_minimal_png(size, output_path):
        """Create a minimal valid single-color PNG."""
        # Dark background pixel
        raw_data = b''
        for y in range(size):
            raw_data += b'\x00'  # filter none
            for x in range(size):
                raw_data += b'\x08\x09\x1a'  # RGB #08091a

        compressed = zlib.compress(raw_data)

        def chunk(chunk_type, data):
            c = chunk_type + data
            crc = struct.pack('>I', zlib.crc32(c) & 0xffffffff)
            return struct.pack('>I', len(data)) + c + crc

        png = b'\x89PNG\r\n\x1a\n'
        png += chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0))
        png += chunk(b'IDAT', compressed)
        png += chunk(b'IEND', b'')

        with open(output_path, 'wb') as f:
            f.write(png)

    for app_dir_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*'))):
        if not os.path.isdir(app_dir_path):
            continue
        if not os.path.exists(os.path.join(app_dir_path, 'index.html')):
            continue

        for size in [192, 512]:
            icon_path = os.path.join(app_dir_path, f'icon-{size}.png')
            if not os.path.exists(icon_path):
                create_minimal_png(size, icon_path)
                created += 1

else:
    for app_dir_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*'))):
        if not os.path.isdir(app_dir_path):
            continue
        if not os.path.exists(os.path.join(app_dir_path, 'index.html')):
            continue

        app_name = os.path.basename(app_dir_path)
        initials = get_initials(app_name)

        for size in [192, 512]:
            icon_path = os.path.join(app_dir_path, f'icon-{size}.png')
            if not os.path.exists(icon_path):
                create_icon(size, initials, icon_path)
                created += 1

print(f"✓ Created {created} icon files")
