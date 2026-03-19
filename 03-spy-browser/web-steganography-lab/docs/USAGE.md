# Usage Guide — Steganography Lab

## Loading an Image

- **Generate Sample**: Creates a procedural landscape image (320x240) with noise for realistic steganography testing.
- **Upload Image**: Load any PNG or JPEG from your device. Images larger than 640px are automatically scaled down.

## Hiding a Message

1. Load an image (sample or upload)
2. Type your secret message in the text area
3. (Optional) Open "Advanced Options" to adjust:
   - **Bits per channel** (1-4): More bits = more capacity but more visible artifacts
   - **Channel selection**: Choose which RGB channels to use
   - **XOR encryption**: Enable and enter a password
4. Click **Hide Message**
5. The stego image appears in the right canvas

## Extracting a Message

1. Ensure the stego image is loaded (either just embedded, or upload a previously created stego image)
2. Match the same settings used during embedding (BPC, channels, encryption)
3. Click **Extract Message**
4. The hidden text appears in the output box

## Visualizations (Section A)

- **Pixel Difference Map**: Shows modified pixels amplified 50x. Bright areas indicate changes.
- **LSB Plane View**: Extracts only LSBs. Random noise = natural image. Structured patterns = embedded data.
- **Byte Inspector**: Click any pixel on either canvas to see its RGB values in binary with LSBs highlighted.

## How LSB Works (Section B)

- Interactive theory explanation
- **Live Encoding Demo**: Type a character to see exactly how its 8 bits are distributed across pixel channels
- **Statistics**: Bits used, pixels modified, PSNR quality metric, detectability rating

## Advanced Options (Section C)

- **Bits Per Channel**: 1 (invisible) to 4 (visible artifacts, 4x capacity)
- **Channel Selection**: Toggle R, G, B independently
- **XOR Encryption**: Simple symmetric encryption before embedding
- **Comparison Slider**: Drag to compare original vs stego image side by side

## Keyboard Shortcuts

- **Escape**: Close all panels
- **Ctrl+Z** (in log): Undo last log entry

## Tips

- Larger images can hold longer messages
- BPC=1 with all channels gives the best invisibility
- Always use the same settings for hiding and extracting
- PNG format preserves LSB data; JPEG compression destroys it
