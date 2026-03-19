# API Reference — Steganography Lab

## Steganography Functions

| Function | Description |
|----------|-------------|
| `generateSampleImage()` | Creates a procedural 320x240 landscape on the original canvas |
| `loadUploadedImage(file)` | Loads a File object onto the original canvas (auto-scales) |
| `embedMessage()` | Reads message input, embeds into original image using LSB, outputs to stego canvas |
| `extractMessage()` | Reads LSBs from stego (or original) canvas, reconstructs hidden message |
| `downloadStegoImage()` | Downloads the stego canvas as PNG |

## Visualization Functions

| Function | Description |
|----------|-------------|
| `renderDiffMap()` | Renders amplified pixel difference between original and stego |
| `renderLSBPlane(channel)` | Renders LSB plane. Channel: `'all'`, `'r'`, `'g'`, `'b'` |
| `inspectPixel(event, canvasId, label)` | Shows binary RGB breakdown of clicked pixel |
| `showEncodingDemo()` | Visualizes bit embedding for a single character |
| `updateComparisonCanvases()` | Updates the side-by-side comparison canvases |

## Helper Functions

| Function | Description |
|----------|-------------|
| `getActiveChannels()` | Returns array of active channel indices `[0,1,2]` |
| `getBPC()` | Returns current bits-per-channel setting (1-4) |
| `xorEncrypt(text, key)` | XOR encrypts/decrypts text with key |
| `calcCapacity(w, h)` | Returns `{totalBits, maxChars, totalPixels}` |
| `updateCapacityUI()` | Updates capacity bar and counters |
| `updateStats(...)` | Calculates and displays PSNR and detectability |

## Template API (inherited)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification |
| `hideToast()` | Hide toast |
| `setStatus(bool)` | Status pill (connected/idle) |
| `setLanguage(lang)` | `'en'`, `'fr'`, `'ar'` |
| `setTheme(name)` | Theme name |
| `playSound(type)` | `'click'`, `'success'`, `'error'` |

## State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `originalImageData` | `ImageData\|null` | Pixel data of loaded original image |
| `stegoImageData` | `ImageData\|null` | Pixel data after embedding |
| `imageLoaded` | `boolean` | Whether an image is loaded |
