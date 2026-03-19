# Steganography Lab — Hidden Messages

Hide secret messages inside normal images using LSB (Least Significant Bit) steganography. Students learn how digital data is concealed within pixel color values, how to encode and decode hidden messages, and how to analyze images for covert data.

## Features

- Canvas-based LSB steganography engine (encode/decode)
- Upload custom images or generate colorful samples
- Before/after visual comparison with slider
- Pixel difference map (amplified 50x)
- LSB plane extraction (all channels or individual R/G/B)
- Byte inspector: click any pixel to see binary representation and LSB highlights
- Live encoding demo: type a character to visualize bit embedding step-by-step
- Embedding statistics: bits used, pixels modified, PSNR, detectability rating
- Adjustable bits-per-channel (1-4) for capacity vs quality tradeoff
- Channel selection (R, G, B toggle)
- Optional XOR encryption with password
- Download stego images as PNG
- Full i18n (English, French, Arabic with RTL)
- 8 visual themes, sound effects, activity log

## How It Works

1. Each pixel has R, G, B channels stored as 8-bit values (0-255)
2. The LSB (rightmost bit) can be changed with no visible difference
3. Message characters are converted to binary (8 bits each)
4. A 32-bit length header is stored first, then message bits
5. Each bit replaces the LSB of successive pixel channels
6. To extract: read LSBs in the same order, reconstruct bytes

## Files

| File | Description |
|------|-------------|
| `index.html` | UI layout with main card, 3 collapsible sections, help/settings panels |
| `script.js` | Template engine + LSB steganography engine (embed, extract, visualize) |
| `style.css` | Template styles (8 themes, responsive, animations) |
| `manifest.json` | PWA manifest |
| `docs/` | Documentation |

## Quick Start

1. Open `index.html` in a browser
2. Click "Generate Sample" or upload your own image
3. Type a secret message
4. Click "Hide Message" to embed
5. Explore Section A to see bit-level changes
6. Click "Extract Message" to recover the hidden text
7. Download the stego image to share

## Privacy

Everything runs locally in the browser. No data is uploaded anywhere.
